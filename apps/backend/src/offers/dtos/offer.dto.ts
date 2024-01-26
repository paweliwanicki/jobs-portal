import { Expose } from 'class-transformer';
import { Company } from '../../dictionaries/company/company.entity';
import { Contract } from '../../dictionaries/contract/contract.entity';

export class OfferDto {
  @Expose()
  id: number;
  @Expose()
  title: string;
  @Expose()
  description: string;
  @Expose()
  location: string;
  @Expose()
  contract: Contract;
  @Expose()
  company: Company;
  @Expose()
  createdAt: number;
  @Expose()
  createdBy: number;
  @Expose()
  modifiedAt: number;
  @Expose()
  modifiedBy: number;
  @Expose()
  unremovable: boolean;
}
