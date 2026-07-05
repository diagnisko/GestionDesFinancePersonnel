import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { AppDataSource } from "../data-source";
import { Budget } from "./budget.entity";
import { Transaction } from "../transactions/transaction.entity";
import { Repository } from "typeorm";

@Injectable()
export class BudgetsService {
  private repo: Repository<Budget>;
  private txRepo: Repository<Transaction>;
  constructor() {
    this.repo = AppDataSource.getRepository(Budget);
    this.txRepo = AppDataSource.getRepository(Transaction);
  }

  create(userId: number, payload: Partial<Budget>) {
    const budget = this.repo.create({ ...payload, user: { id: userId } as any });
    return this.repo.save(budget);
  }

  findAllForUser(userId: number) {
    return this.repo.find({ where: { user: { id: userId } }, order: { category: 'ASC' } });
  }

  /** Fix IDOR: vérifie que le budget appartient bien à l'utilisateur. */
  async findOneForUser(id: number, userId: number) {
    const budget = await this.repo.findOne({ where: { id }, relations: ['user'] });
    if (!budget) throw new NotFoundException('Budget not found');
    if (budget.user.id !== userId) throw new ForbiddenException('Access denied');
    return budget;
  }

  async update(id: number, userId: number, payload: Partial<Budget>) {
    const budget = await this.findOneForUser(id, userId);
    Object.assign(budget, payload);
    return this.repo.save(budget);
  }

  async remove(id: number, userId: number) {
    const budget = await this.findOneForUser(id, userId);
    return this.repo.remove(budget);
  }

  async getAlerts(userId: number) {
    const budgets = await this.repo.find({ where: { user: { id: userId } } });
    const transactions = await this.txRepo.find({
      where: { user: { id: userId }, type: 'expense' },
    });

    const alerts: { category: string; budget: number; spent: number; percentage: number }[] = [];

    for (const budget of budgets) {
      const spent = transactions
        .filter((t) => t.category === budget.category)
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const percentage = budget.amount > 0 ? Math.round((spent / Number(budget.amount)) * 100) : 0;

      if (percentage >= 80) {
        alerts.push({
          category: budget.category,
          budget: Number(budget.amount),
          spent,
          percentage,
        });
      }
    }

    return alerts;
  }
}
