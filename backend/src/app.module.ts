import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { TransactionsModule } from "./transactions/transactions.module";
import { SavingsGoalsModule } from "./savings-goals/savings-goals.module";
import { BudgetsModule } from "./budgets/budgets.module";
import { AccountsModule } from "./accounts/accounts.module";
import { CommonModule } from "./common/common.module";

@Module({
  imports: [UsersModule, AuthModule, TransactionsModule, SavingsGoalsModule, BudgetsModule, AccountsModule, CommonModule]
})
export class AppModule {}
