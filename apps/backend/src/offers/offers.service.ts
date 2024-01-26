import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './offer.entity';
import { ILike, Repository } from 'typeorm';
import { OFFER_EXCEPTION_MESSAGES } from './offer-exception.messages';
import { CompanyService } from '../dictionaries/company/company.service';
import { ContractService } from '../dictionaries/contract/contract.service';
import { NewOfferDto } from './dtos/new-offer.dto';
import { FiltersOfferDto } from './dtos/filters-offer.dto';

@Injectable()
export class OffersService {
  constructor(
    private companyService: CompanyService,
    private contractService: ContractService,
    @InjectRepository(Offer) private offerRepository: Repository<Offer>,
  ) {}

  async create(offer: NewOfferDto) {
    const newOffer = this.offerRepository.create(offer);
    return await this.offerRepository.save(newOffer);
  }

  async findOneById(id: number) {
    if (!id) return null;
    return await this.offerRepository.findOne({
      where: { id: id },
      relations: { company: true, contract: true },
    });
  }

  async findByUserId(createdBy: number) {
    return this.offerRepository.find({ where: { createdBy } });
  }

  async findOne(where: FiltersOfferDto) {
    return await this.offerRepository.findOne({
      where,
      relations: { company: true, contract: true },
    });
  }

  async findAll(filters: FiltersOfferDto) {
    const { activePage, itemsPerPage, ...where } = filters;

    if (where.title) {
      where.title = ILike(`%${where.title}%`);
    }

    return await this.offerRepository.findAndCount({
      where,
      relations: { company: true, contract: true },
      order: {
        createdAt: 'DESC',
      },
      take: itemsPerPage ?? 12,
      skip:
        itemsPerPage && activePage > 1 ? itemsPerPage * (activePage - 1) : 0,
    });
  }

  async update(id: number, attrs: Partial<Offer>) {
    const offer = await this.findOneById(id);
    if (!offer) {
      throw new NotFoundException(OFFER_EXCEPTION_MESSAGES.NOT_FOUND);
    }
    Object.assign(offer, attrs);
    return this.offerRepository.save(offer);
  }

  async remove(id: number) {
    const offer = await this.findOneById(id);
    if (!offer) {
      throw new NotFoundException(OFFER_EXCEPTION_MESSAGES.NOT_FOUND);
    }
    if (offer.unremovable) {
      throw new NotFoundException(OFFER_EXCEPTION_MESSAGES.UNREMOVABLE);
    }
    return this.offerRepository.remove(offer);
  }
}
