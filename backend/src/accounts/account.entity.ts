import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Transaction } from "../transactions/transaction.entity";
import { DecimalTransformer } from "../common/decimal.transformer";

export type AccountType = 'checking' | 'savings' | 'cash' | 'credit';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: 'varchar', length: 20 })
  type!: AccountType;

  @Column('decimal', { precision: 14, scale: 2, default: 0, transformer: DecimalTransformer })
  balance!: number;

  @Column({ nullable: true })
  currency?: string;

  @ManyToOne(() => User, (u) => u.accounts, { onDelete: 'CASCADE' })
  user!: User;

  @OneToMany(() => Transaction, (t) => t.account)
  transactions!: Transaction[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
