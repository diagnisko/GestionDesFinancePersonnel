import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Transaction } from "../transactions/transaction.entity";
import { SavingsGoal } from "../savings-goals/savings-goal.entity";
import { Budget } from "../budgets/budget.entity";
import { Account } from "../accounts/account.entity";

export type UserRole = 'user' | 'admin';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstname: string;

  @Column({ nullable: true })
  lastname: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ default: 'user' })
  role: UserRole;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @Column({ name: 'refresh_token_hash', nullable: true })
  refreshTokenHash: string | null;

  @OneToMany(() => Transaction, (t) => t.user)
  transactions: Transaction[];

  @OneToMany(() => SavingsGoal, (s) => s.user)
  savingsGoals: SavingsGoal[];

  @OneToMany(() => Budget, (b) => b.user)
  budgets: Budget[];

  @OneToMany(() => Account, (a) => a.user)
  accounts: Account[];

  /**
   * Représentation sûre de l'utilisateur pour les réponses API.
   * passwordHash et refreshTokenHash ne doivent JAMAIS quitter le backend.
   */
  toSafeObject() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, refreshTokenHash, ...safe } = this;
    return safe;
  }
}
