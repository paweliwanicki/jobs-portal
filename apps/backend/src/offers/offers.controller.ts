import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Delete,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { UpdateOfferDto } from './dtos/update-offer.dto';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CompanyService } from '../dictionaries/company/company.service';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { ContractService } from '../dictionaries/contract/contract.service';
import { FiltersOfferDto } from './dtos/filters-offer.dto';

@Controller('offers')
export class OffersController {
  constructor(
    private offersService: OffersService,
    private companyService: CompanyService,
    private contractService: ContractService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async addOffer(@Body() body: UpdateOfferDto, @CurrentUser() user: User) {
    const { company: companyId, contract: contractId } = body;

    const company = await this.companyService.findOneById(companyId);
    const contract = await this.contractService.findOneById(contractId);
    const newOffer = {
      ...body,
      company,
      contract,
      createdAt: Math.floor(new Date().getTime() / 1000),
      createdBy: user.id,
    };

    const offer = await this.offersService.create(newOffer);
    return offer;
  }

  @Get('/:id')
  async findOffer(@Param('id') id: string) {
    const offer = await this.offersService.findOneById(parseInt(id));
    if (!offer) {
      throw new NotFoundException();
    }
    return offer;
  }

  @Post('/archive')
  async findArchivedOffers(@Body() filters: FiltersOfferDto) {
    filters.archived = true;
    return await this.offersService.findAll(filters);
  }

  @Post('/archive/:id')
  async archiveOffer(@Param('id') id: number) {
    const offer = await this.offersService.findOneById(id);
    offer.archived = true;
    const updatedOffer = await this.offersService.update(id, offer);
    return updatedOffer.archived;
  }

  @Post('/all')
  async findOffers(@Body() filters: FiltersOfferDto) {
    return await this.offersService.findAll(filters);
  }

  @Post('/my')
  @UseGuards(JwtAuthGuard)
  async findMyOffers(
    @Body() filters: FiltersOfferDto,
    @CurrentUser() user: User,
  ) {
    filters.createdBy = user.id;
    return await this.offersService.findAll(filters);
  }

  @Post('/myArchive')
  @UseGuards(JwtAuthGuard)
  async findMyArchivedOffers(
    @Body() filters: FiltersOfferDto,
    @CurrentUser() user: User,
  ) {
    filters.createdBy = user.id;
    filters.archived = true;
    return await this.offersService.findAll(filters);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async removeOffer(@Param('id') id: string) {
    return await this.offersService.remove(parseInt(id));
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async updateOffer(@Body() body: UpdateOfferDto, @CurrentUser() user: User) {
    const { id, company: companyId, contract: contractId } = body;

    const company = await this.companyService.findOneById(companyId);
    const contract = await this.contractService.findOneById(contractId);
    const updOffer = {
      ...body,
      company,
      contract,
      modifiedAt: Math.floor(new Date().getTime() / 1000),
      modifiedBy: user.id,
    };
    return await this.offersService.update(id, updOffer);
  }

  @Post('uploadCompanyLogo')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req: never, file: never, cb: any) => {
          const uploadPath = 'uploads/';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath);
          }
          cb(null, uploadPath);
        },
        filename: (req: never, file: any, cb: any) => {
          cb(null, `${file.originalname.replace(/\s/g, '_')}`);
        },
      }),
    }),
  )
  async uploadCompanyLogo(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body('companyId') companyId: number,
  ) {
    await this.companyService.setCompanyLogo(companyId, file);
    return {
      file: file.buffer?.toString(),
    };
  }
}
