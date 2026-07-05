import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBudgetDto {
  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

export class UpdateBudgetDto {
  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;
}
