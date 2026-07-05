import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { AppDataSource } from "../data-source";
import { Account } from "./account.entity";
import { Repository } from "typeorm";

@Injectable()
export class AccountsService {
  private repo: Repository<Account>;
  constructor() {
    this.repo = AppDataSource.getRepository(Account);
  }

  create(userId: number, payload: Partial<Account>) {
    const account = this.repo.create({ ...payload, user: { id: userId } as any });
    return this.repo.save(account);
  }

  findAllForUser(userId: number) {
    return this.repo.find({ where: { user: { id: userId } }, order: { name: 'ASC' } });
  }

  /**
   * Récupère un compte et vérifie qu'il appartient bien à l'utilisateur
   * authentifié. Sans ce contrôle, n'importe quel utilisateur connecté
   * pouvait lire/modifier/supprimer les comptes d'un autre utilisateur
   * simplement en devinant un id (faille IDOR).
   */
  async findOneForUser(id: number, userId: number) {
    const account = await this.repo.findOne({ where: { id }, relations: ['user'] });
    if (!account) throw new NotFoundException('Account not found');
    if (account.user.id !== userId) throw new ForbiddenException('Access denied');
    return account;
  }

  async update(id: number, userId: number, payload: Partial<Account>) {
    const account = await this.findOneForUser(id, userId);
    Object.assign(account, payload);
    return this.repo.save(account);
  }

  async remove(id: number, userId: number) {
    const account = await this.findOneForUser(id, userId);
    return this.repo.remove(account);
  }

  /** Ajuste le solde d'un compte (utilisé par TransactionsService). */
  async adjustBalance(accountId: number, delta: number) {
    const account = await this.repo.findOne({ where: { id: accountId } });
    if (!account) return;
    account.balance = Number(account.balance) + delta;
    await this.repo.save(account);
  }
}
