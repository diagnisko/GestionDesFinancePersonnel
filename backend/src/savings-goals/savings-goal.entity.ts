import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "../users/user.entity";
import { DecimalTransformer } from "../common/decimal.transformer";

@Entity()
export class SavingsGoal {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column('decimal', { precision: 14, scale: 2, transformer: DecimalTransformer })
  targetAmount!: number;

  @Column('decimal', { precision: 14, scale: 2, default: 0, transformer: DecimalTransformer })
  currentAmount!: number;

  @Column({ type: 'date', nullable: true })
  deadline!: string | null;

  @ManyToOne(() => User, (u) => u.savingsGoals, { onDelete: 'CASCADE' })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
