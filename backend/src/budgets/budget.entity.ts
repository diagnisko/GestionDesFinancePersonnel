import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "../users/user.entity";
import { DecimalTransformer } from "../common/decimal.transformer";

@Entity()
export class Budget {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  category!: string;

  @Column('decimal', { precision: 14, scale: 2, transformer: DecimalTransformer })
  amount!: number;

  @ManyToOne(() => User, (u) => u.budgets, { onDelete: 'CASCADE' })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
