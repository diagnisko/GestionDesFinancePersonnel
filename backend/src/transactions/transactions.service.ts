import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { AppDataSource } from "../data-source";
import { Transaction } from "./transaction.entity";
import { Repository } from "typeorm";
import { AccountsService } from "../accounts/accounts.service";

@Injectable()
export class TransactionsService {
  private repo: Repository<Transaction>;
  constructor(private accountsService: AccountsService) {
    this.repo = AppDataSource.getRepository(Transaction);
  }

  private effect(t: { amount: number; type: 'income' | 'expense' }) {
    return t.type === 'income' ? Number(t.amount) : -Number(t.amount);
  }

  async create(userId: number, payload: Partial<Transaction> & { accountId?: number | null }) {
    const { accountId, ...rest } = payload as any;

    let account: any = null;
    if (accountId) {
      // Vérifie que le compte appartient bien à l'utilisateur avant de le lier.
      account = await this.accountsService.findOneForUser(Number(accountId), userId);
    }

    const t = this.repo.create({ ...rest, account: account ? { id: account.id } : null } as any);
    const saved = await this.repo.save(t as any);

    if (account) {
      await this.accountsService.adjustBalance(account.id, this.effect(saved as any));
    }

    return saved;
  }

  findAllForUser(userId: number) {
    return this.repo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      relations: ['account'],
    });
  }

  /**
   * Récupère une transaction et vérifie qu'elle appartient bien à
   * l'utilisateur authentifié (fix IDOR — voir AccountsService.findOneForUser).
   */
  async findOneForUser(id: number, userId: number) {
    const t = await this.repo.findOne({ where: { id }, relations: ['user', 'account'] });
    if (!t) throw new NotFoundException('Transaction not found');
    if (t.user.id !== userId) throw new ForbiddenException('Access denied');
    return t;
  }

  async update(id: number, userId: number, payload: Partial<Transaction> & { accountId?: number | null }) {
    const t = await this.findOneForUser(id, userId);
    const previousAccountId = t.account?.id ?? null;
    const previousEffect = this.effect(t);

    const { accountId, ...rest } = payload as any;
    Object.assign(t, rest);

    if (accountId !== undefined) {
      if (accountId === null) {
        t.account = null;
      } else {
        t.account = await this.accountsService.findOneForUser(Number(accountId), userId);
      }
    }

    const saved = await this.repo.save(t);

    // Réajuste les soldes: on annule l'effet précédent puis on applique le nouveau.
    if (previousAccountId) {
      await this.accountsService.adjustBalance(previousAccountId, -previousEffect);
    }
    if (saved.account) {
      await this.accountsService.adjustBalance(saved.account.id, this.effect(saved));
    }

    return saved;
  }

  async remove(id: number, userId: number) {
    const t = await this.findOneForUser(id, userId);
    if (t.account) {
      await this.accountsService.adjustBalance(t.account.id, -this.effect(t));
    }
    return this.repo.remove(t);
  }

  async getStats(userId: number) {
    const transactions = await this.repo.find({ where: { user: { id: userId } } });

    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const categoryMap: Record<string, number> = {};
    transactions
      .filter((t) => t.type === 'expense' && t.category)
      .forEach((t) => {
        categoryMap[t.category!] = (categoryMap[t.category!] || 0) + Number(t.amount);
      });

    const expensesByCategory = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const monthlyMap: Record<string, { month: string; revenu: number; depense: number }> = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
      monthlyMap[key] = { month: label, revenu: 0, depense: 0 };
    }

    transactions
      .filter((t) => new Date(t.createdAt) >= sixMonthsAgo)
      .forEach((t) => {
        const d = new Date(t.createdAt);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (monthlyMap[key]) {
          if (t.type === 'income') monthlyMap[key].revenu += Number(t.amount);
          else monthlyMap[key].depense += Number(t.amount);
        }
      });

    const monthlyStats = Object.values(monthlyMap);

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      expensesByCategory,
      monthlyStats,
    };
  }

  async exportCsv(userId: number): Promise<string> {
    const transactions = await this.repo.find({ where: { user: { id: userId } }, order: { createdAt: 'DESC' } });
    const rows = [
      'Date,Type,Description,Categorie,Montant,Devise',
      ...transactions.map((t) =>
        [
          new Date(t.createdAt).toISOString().split('T')[0],
          t.type === 'income' ? 'Revenu' : 'Depense',
          `"${t.description.replace(/"/g, '""')}"`,
          t.category || '',
          t.amount,
          t.currency,
        ].join(',')
      ),
    ];
    return rows.join('\n');
  }
}
