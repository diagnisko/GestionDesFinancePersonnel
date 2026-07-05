import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateSavingsGoalDto {
  @IsString()
  name: string;

  @IsNumber()
  targetAmount: number;

  @IsNumber()
  @IsOptional()
  currentAmount?: number;

  @IsDateString()
  @IsOptional()
  deadline?: string;
}

export class UpdateSavingsGoalDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  targetAmount?: number;

  @IsNumber()
  @IsOptional()
  currentAmount?: number;

  @IsDateString()
  @IsOptional()
  deadline?: string;
}
