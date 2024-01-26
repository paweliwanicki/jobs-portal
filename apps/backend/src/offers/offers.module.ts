import { Module } from '@nestjs/common';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { Offer } from './offer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from '../authentication/authentication.module';
import { MulterModule } from '@nestjs/platform-express';
import { CompanyModule } from '../dictionaries/company/company.module';
import { ContractModule } from '../dictionaries/contract/contract.module';

@Module({
  controllers: [OffersController],
  providers: [OffersService],
  imports: [
    TypeOrmModule.forFeature([Offer]),
    MulterModule.register({
      dest: './uploads',
    }),
    AuthenticationModule,
    CompanyModule,
    ContractModule,
  ],
  exports: [OffersService],
})
export class OffersModule {}
