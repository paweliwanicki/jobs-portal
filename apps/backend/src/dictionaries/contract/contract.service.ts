import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contract } from './contract.entity';
import { Repository } from 'typeorm';
import { UpdateContractDto } from './dtos/update-contract.dto';
import { CONTRACT_EXCEPTION_MESSAGES } from './contract-exception.messages';
import { ImportOfferDto } from '../../offers/dtos/import-offer.dto';
import { User } from '../../users/user.entity';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract)
    private contractRepository: Repository<Contract>,
  ) {}

  async create(contract: UpdateContractDto) {
    contract.createdAt = Math.floor(new Date().getTime() / 1000);
    const newContract = this.contractRepository.create(contract);
    return await this.contractRepository.save(newContract);
  }

  async findOneById(id: number) {
    if (!id) return null;
    return await this.contractRepository.findOneBy({ id });
  }

  async findOne(where: any) {
    return await this.contractRepository.findOne({ where: { ...where } });
  }

  async getAll() {
    return await this.contractRepository.find({
      order: {
        name: 'asc',
      },
    });
  }

  async update(id: number, attrs: Partial<Contract>) {
    const contract = await this.findOneById(id);
    if (!contract) {
      throw new NotFoundException(CONTRACT_EXCEPTION_MESSAGES.NOT_FOUND);
    }
    Object.assign(contract, attrs);
    return this.contractRepository.save(contract);
  }

  async remove(id: number) {
    const contract = await this.findOneById(id);
    if (!contract) {
      throw new NotFoundException(CONTRACT_EXCEPTION_MESSAGES.NOT_FOUND);
    }
    return this.contractRepository.remove(contract);
  }

  async importContracts(data: ImportOfferDto[], user: User) {
    console.warn('1 step - import definition of contracts');
    if (data.length) {
      data.forEach(async ({ contract }: ImportOfferDto) => {
        const exist = await this.findOne({ name: contract });
        if (exist) {
          console.warn(`${contract} is already exist!`);
          return;
        }
        return await this.create({
          name: contract,
          createdBy: user.id,
          createdAt: Math.floor(new Date().getTime() / 1000),
        } as Contract);
      });
    }
    console.warn('2 step - ending import definition of contracts');
  }
}
