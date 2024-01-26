import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Company } from './company.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from '../../authentication/authentication.module';

@Module({
  imports: [TypeOrmModule.forFeature([Company]), AuthenticationModule],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
