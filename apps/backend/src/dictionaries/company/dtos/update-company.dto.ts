import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCompanyDto {
  @IsOptional()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  logoFileName: string;

  @IsOptional()
  modifiedBy: number;

  @IsOptional()
  modifiedAt: number;

  @IsOptional()
  createdBy: number;

  @IsOptional()
  createdAt: number;
}
