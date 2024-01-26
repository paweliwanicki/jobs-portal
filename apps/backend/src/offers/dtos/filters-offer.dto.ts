import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { FindOperator } from 'typeorm';

export class FiltersOfferDto {
  @IsString()
  @IsOptional()
  title: FindOperator<string>;

  @IsString()
  @IsOptional()
  location: string;

  @IsOptional()
  contract: {
    id: number;
  };

  @IsOptional()
  company: {
    id: number;
  };

  @IsBoolean()
  @IsOptional()
  archived = false;

  @IsNumber()
  @IsOptional()
  activePage: number;

  @IsNumber()
  @IsOptional()
  itemsPerPage: number;

  @IsOptional()
  createdBy: number;
}
