import { IsNotEmpty, IsNumber, IsString, IsOptional, IsIn, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsIn(['income', 'expense'])
  type?: 'income' | 'expense';

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  accountId?: number;
}
