import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./users/user.entity";
import { Transaction } from "./transactions/transaction.entity";
import { SavingsGoal } from "./savings-goals/savings-goal.entity";
import { Budget } from "./budgets/budget.entity";
import { Account } from "./accounts/account.entity";
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'financeflow_db',
  synchronize: process.env.TYPEORM_SYNC === 'true' ? true : false,
  logging: process.env.TYPEORM_LOGGING === 'true' ? true : false,
  entities: [User, Transaction, SavingsGoal, Budget, Account],
  timezone: 'Z'
});
