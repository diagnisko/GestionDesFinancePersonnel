import { IsString, IsNumber, IsOptional, IsIn } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  name: string;

  @IsIn(['checking', 'savings', 'cash', 'credit'])
  type: 'checking' | 'savings' | 'cash' | 'credit';

  @IsNumber()
  @IsOptional()
  balance?: number;

  @IsString()
  @IsOptional()
  currency?: string;
}

export class UpdateAccountDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsIn(['checking', 'savings', 'cash', 'credit'])
  @IsOptional()
  type?: 'checking' | 'savings' | 'cash' | 'credit';

  @IsNumber()
  @IsOptional()
  balance?: number;

  @IsString()
  @IsOptional()
  currency?: string;
}
