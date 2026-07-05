import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { AppDataSource } from "../data-source";
import { SavingsGoal } from "./savings-goal.entity";
import { Repository } from "typeorm";

@Injectable()
export class SavingsGoalsService {
  private repo: Repository<SavingsGoal>;
  constructor() {
    this.repo = AppDataSource.getRepository(SavingsGoal);
  }

  create(userId: number, payload: Partial<SavingsGoal>) {
    const goal = this.repo.create({ ...payload, user: { id: userId } as any });
    return this.repo.save(goal);
  }

  findAllForUser(userId: number) {
    return this.repo.find({ where: { user: { id: userId } }, order: { createdAt: 'DESC' } });
  }

  /** Fix IDOR: vérifie que l'objectif appartient bien à l'utilisateur. */
  async findOneForUser(id: number, userId: number) {
    const goal = await this.repo.findOne({ where: { id }, relations: ['user'] });
    if (!goal) throw new NotFoundException('Savings goal not found');
    if (goal.user.id !== userId) throw new ForbiddenException('Access denied');
    return goal;
  }

  async update(id: number, userId: number, payload: Partial<SavingsGoal>) {
    const goal = await this.findOneForUser(id, userId);
    Object.assign(goal, payload);
    return this.repo.save(goal);
  }

  async remove(id: number, userId: number) {
    const goal = await this.findOneForUser(id, userId);
    return this.repo.remove(goal);
  }
}
