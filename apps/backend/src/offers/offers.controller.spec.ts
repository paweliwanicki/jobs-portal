import { Test, TestingModule } from '@nestjs/testing';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { CanActivate } from '@nestjs/common';

describe('OffersController', () => {
  let controller: OffersController;

  const mockOffersService = {
    findOneById: jest.fn((id) => {
      const offer = {
        id: +id,
        title: 'Test',
        description: 'Test',
        location: 'Test',
      };
      return offer;
    }),
    findAll: jest.fn((filters) => {
      const offers = [
        {
          id: 1,
          title: 'Test1',
          description: 'Test1',
          location: 'Test1',
        },
        {
          id: 2,
          title: 'Test2',
          description: 'Test2',
          location: 'Test2',
        },
        {
          id: 3,
          title: 'Test3',
          description: 'Test3',
          location: 'Test3',
        },
      ];
    }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    create: jest.fn((offer) => {
      return {
        id: Date.now(),
        ...offer,
      };
    }),
    update: jest.fn((id, { ...details }) => {
      return {
        id,
        ...details,
      };
    }),
    remove: jest.fn((id) => {
      const offer = {
        id: +id,
        title: 'Test',
        description: 'Test',
        location: 'Test',
      };
      return offer;
    }),
  };

  const mockJwtAuthGuard: CanActivate = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OffersController],
      providers: [OffersService, JwtAuthGuard],
    })
      .overrideProvider(OffersService)
      .useValue(mockOffersService)
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<OffersController>(OffersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
