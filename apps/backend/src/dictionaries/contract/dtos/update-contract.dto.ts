import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateContractDto {
  @IsOptional()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  modifiedBy: number;

  @IsOptional()
  modifiedAt: number;

  @IsOptional()
  createdBy: number;

  @IsOptional()
  createdAt: number;
}
