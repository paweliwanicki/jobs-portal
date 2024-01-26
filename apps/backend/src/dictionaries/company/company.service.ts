import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { Repository } from 'typeorm';
import { UpdateCompanyDto } from './dtos/update-company.dto';
import { COMPANY_EXCEPTION_MESSAGES } from './company-exception.messages';
import { ImportOfferDto } from '../../offers/dtos/import-offer.dto';
import { User } from '../../users/user.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company) private companyRepository: Repository<Company>,
  ) {}

  async create(company: UpdateCompanyDto) {
    company.createdAt = Math.floor(new Date().getTime() / 1000);
    const newCompany = this.companyRepository.create(company);
    return await this.companyRepository.save(newCompany);
  }

  async findOneById(id: number) {
    if (!id) return null;
    return await this.companyRepository.findOneBy({ id });
  }

  async findOne(where: any) {
    return await this.companyRepository.findOne({ where: { ...where } });
  }

  async getAll() {
    return await this.companyRepository.find({
      order: {
        name: 'asc',
      },
    });
  }

  async update(id: number, attrs: Partial<Company>) {
    const company = await this.findOneById(id);
    if (!company) {
      throw new NotFoundException(COMPANY_EXCEPTION_MESSAGES.NOT_FOUND);
    }
    Object.assign(company, attrs);
    return this.companyRepository.save(company);
  }

  async remove(id: number) {
    const company = await this.findOneById(id);
    if (!company) {
      throw new NotFoundException(COMPANY_EXCEPTION_MESSAGES.NOT_FOUND);
    }
    return this.companyRepository.remove(company);
  }

  async importCompanies(data: ImportOfferDto[], user: User) {
    console.warn('1 step - import definitions of companies');
    if (data.length) {
      data.forEach(async ({ company, logoFileName }: ImportOfferDto) => {
        const exist = await this.findOne({ name: company });
        if (exist) {
          console.warn(`${company} is already exist!`);
          return;
        }

        return await this.create({
          name: company,
          logoFileName,
          createdBy: user.id,
        } as Company);
      });
    }
    console.warn('2 step - ending import definitions of companies');
  }

  async setCompanyLogo(companyId: number, file: Express.Multer.File) {
    const { filename } = file;
    return await this.update(companyId, {
      logoFileName: filename,
    });
  }
}
