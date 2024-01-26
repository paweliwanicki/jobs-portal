import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from './contract.entity';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';

@Module({
  imports: [TypeOrmModule.forFeature([Contract]), AuthenticationModule],
  controllers: [ContractController],
  providers: [ContractService],
  exports: [ContractService],
})
export class ContractModule {}
