import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Account } from "../accounts/account.entity";
import { DecimalTransformer } from "../common/decimal.transformer";

export type TransactionType = 'income' | 'expense';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column('decimal', { precision: 14, scale: 2, transformer: DecimalTransformer })
  amount: number;

  @Column({ default: 'XOF' })
  currency: string;

  @Column({ type: 'enum', enum: ['income', 'expense'], default: 'expense' })
  type: TransactionType;

  @Column({ nullable: true })
  category: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (u) => u.transactions)
  user: User;

  @ManyToOne(() => Account, (a) => a.transactions, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'account_id' })
  account: Account | null;
}
