import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { User } from '../../users/user.entity';

class ImportOfferRequierement {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  @IsNotEmpty()
  items: Array<string>;
}

class ImportOfferRole {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  @IsNotEmpty()
  items: Array<string>;
}

export class ImportOfferDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  contract: string;

  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsNotEmpty()
  logoFileName: string;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsNotEmpty()
  role: ImportOfferRole;

  @IsNotEmpty()
  requirements: ImportOfferRequierement;

  @IsNotEmpty()
  user: User;

  @IsOptional()
  unremovable: boolean;

  @IsOptional()
  createdAt: number;

  @IsOptional()
  createdBy: number;
}
