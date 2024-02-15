import { Test, TestingModule } from '@nestjs/testing';
import { OffersService } from './offers.service';
import { Offer } from './offer.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Contract } from '../dictionaries/contract/contract.entity';
import { Company } from '../dictionaries/company/company.entity';
import { NotFoundException } from '@nestjs/common';
import { OFFER_EXCEPTION_MESSAGES } from './offer-exception.messages';
import { ILike } from 'typeorm';

describe('OffersService', () => {
  let service: OffersService;

  const mockContractEntity: Contract = {
    id: 1,
    name: 'TestContract',
    createdAt: Date.now(),
    createdBy: 1,
    modifiedBy: null,
    modifiedAt: null,
    offer: null,
    logInsert: null,
    logUpdate: null,
    logRemove: null,
  };

  const mockCompanyEntity: Company = {
    id: 1,
    name: 'TestCompany',
    logoFileName: 'logoFileName',
    createdAt: Date.now(),
    createdBy: 1,
    modifiedBy: null,
    modifiedAt: null,
    offer: null,
    logInsert: null,
    logUpdate: null,
    logRemove: null,
  };

  const newOffer = {
    title: 'New',
    description: 'Description',
    location: 'Wroclaw',
    contract: mockContractEntity,
    company: mockCompanyEntity,
    unremovable: true,
    createdAt: Date.now(),
    createdBy: 1,
  };

  const offer1 = {
    id: 1,
    title: 'offer1',
    description: 'Description',
    location: 'Wroclaw',
    contract: mockContractEntity,
    company: mockCompanyEntity,
    unremovable: true,
    createdAt: Date.now(),
    createdBy: 1,
  };
  const offer2 = {
    id: 2,
    title: 'offer2',
    description: 'Description2',
    location: 'Warszawa',
    contract: mockContractEntity,
    company: mockCompanyEntity,
    unremovable: false,
    createdAt: Date.now(),
    createdBy: 1,
  };

  const offerEntities = [offer1, offer2];

  const mockOfferRepository = {
    create: jest.fn().mockImplementation((dto) => ({
      ...dto,
      createdAt: Date.now(),
    })),
    save: jest.fn().mockImplementation((offer) =>
      Promise.resolve({
        id: Date.now(),
        ...offer,
      }),
    ),
    update: jest.fn().mockImplementation((id, attr) => ({
      id,
      ...attr,
      updatedAt: Date.now(),
      updatedBy: 1,
    })),
    remove: jest.fn().mockImplementation((offer) => offer),
    findOne: jest.fn().mockImplementation(({ where: filters }) => {
      const result = offerEntities.find((offer) => {
        for (const key in filters) {
          if (offer[key] !== filters[key]) {
            return false;
          }
        }
        return offer;
      });

      return result;
    }),
    findAndCount: jest.fn().mockImplementation((filters) => {
      const results = offerEntities.filter((offer) => {
        for (const key in filters) {
          if (offer[key] !== filters[key]) {
            return false;
          }
        }
        return offer;
      });
      return [results.length, results];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OffersService,
        {
          provide: getRepositoryToken(Offer),
          useValue: mockOfferRepository,
        },
      ],
    }).compile();

    service = module.get<OffersService>(OffersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new offer record and save in repository', async () => {
    expect(await service.create(newOffer)).toEqual({
      id: expect.any(Number),
      ...newOffer,
      createdAt: expect.any(Number),
    });
  });

  it('should find one offer by id', async () => {
    const id = 1;
    expect(await service.findOneById(id)).toEqual(offer1);
  });

  it('should update the offer', async () => {
    const updOffer = {
      title: 'UpdatedTitle',
    };
    expect(await service.update(1, updOffer)).toEqual({
      id: expect.any(Number),
      ...newOffer,
      ...updOffer,
      createdAt: expect.any(Number),
    });
  });

  it('should remove the offer', async () => {
    await expect(async () => {
      await service.remove(1);
    }).rejects.toThrow(
      new NotFoundException(OFFER_EXCEPTION_MESSAGES.UNREMOVABLE),
    );

    offer1.unremovable = false;
    expect(await service.remove(1)).toEqual(offer1);
  });

  it('should find all offer by title', async () => {
    const filters = {
      title: ILike('%New%'),
    };

    expect(await service.findAll(filters)).toEqual([0, []]);
  });
});
