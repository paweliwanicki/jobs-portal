import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contract } from './contract.entity';
import { Repository } from 'typeorm';
import { UpdateContractDto } from './dtos/update-contract.dto';
import { CONTRACT_EXCEPTION_MESSAGES } from './contract-exception.messages';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract)
    private contractRepository: Repository<Contract>,
  ) {}

  create(contract: UpdateContractDto) {
    contract.createdAt = Math.floor(new Date().getTime() / 1000);
    const newContract = this.contractRepository.create(contract);
    return this.contractRepository.save(newContract);
  }

  async findOneById(id: number) {
    if (!id) return null;
    return await this.contractRepository.findOneBy({ id });
  }

  async findOne(where: any) {
    return await this.contractRepository.findOne({ where: { ...where } });
  }

  async getAll() {
    return await this.contractRepository.find();
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

  async importCompanies(body: any[]) {
    const currentCompanies = await this.getAll();

    if (body.length) {
      body.map((offer: any) => {
        const exist = currentCompanies.find(
          (contract: Contract) => contract.name === offer.contract,
        );
        if (exist) {
          console.warn(`${offer.contract} is already exist!`);
          return false;
        }

        this.create({
          name: offer.contract,
          logoFileName: offer.logo.split('/')[3],
          createdBy: 1,
        } as Contract).then((contract: Contract) => {
          currentCompanies.push(contract);
        });
      });
    }

    return currentCompanies;
  }

  async setContractLogo(contractId: number, file: Express.Multer.File) {
    const { filename } = file;
    return await this.update(contractId, {
      logoFileName: filename,
    });
  }
}
