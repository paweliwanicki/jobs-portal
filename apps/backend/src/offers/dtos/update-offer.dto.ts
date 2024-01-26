import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateOfferDto {
  @IsOptional()
  id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNumber()
  @IsNotEmpty()
  contract: number;

  @IsNumber()
  @IsNotEmpty()
  company: number;

  @IsOptional()
  unremovable: boolean;

  @IsOptional()
  createdAt: number;

  @IsOptional()
  createdBy: number;
}
