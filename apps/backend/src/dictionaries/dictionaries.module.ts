import { Module } from '@nestjs/common';
import { DictionariesController } from './dictionaries.controller';
import { DictionariesService } from './dictionaries.service';
import { ContractModule } from './contract/contract.module';
import { CompanyModule } from './company/company.module';
import { CompanyController } from './company/company.controller';
import { ContractController } from './contract/contract.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from './contract/contract.entity';
import { Company } from './company/company.entity';
import { AuthenticationModule } from '../authentication/authentication.module';
import { ContractService } from './contract/contract.service';
import { CompanyService } from './company/company.service';

@Module({
  controllers: [DictionariesController, CompanyController, ContractController],
  providers: [DictionariesService, ContractService, CompanyService],

  imports: [
    AuthenticationModule,
    TypeOrmModule.forFeature([Contract, Company]),
    ContractModule,
    CompanyModule,
  ],
})
export class DictionariesModule {}
