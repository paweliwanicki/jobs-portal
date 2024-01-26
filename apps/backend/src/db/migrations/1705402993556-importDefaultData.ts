import { Company } from '../../dictionaries/company/company.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { Contract } from '../../dictionaries/contract/contract.entity';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ImportOfferDto } from '../../offers/dtos/import-offer.dto';
import { NewOfferDto } from '../../offers/dtos/new-offer.dto';
import { Offer } from '../../offers/offer.entity';

export class ImportDefaultCompaniesAndContracts1705402993556
  implements MigrationInterface
{
  private defaultOffersIds: number[] = [];

  private async importDefaultOffers(queryRunner: QueryRunner) {
    const offerRepository = queryRunner.connection.getRepository<Offer>(Offer);

    try {
      const offersDataJson = readFileSync(
        join(__dirname, '..', '..', 'offers', 'offers.json'),
        'utf8',
      );

      for (const {
        company,
        contract,
        position,
        description,
        location,
        role,
        requirements,
      } of JSON.parse(offersDataJson) as ImportOfferDto[]) {
        const existingCompany = await queryRunner.manager.findOneBy(Company, {
          name: company,
        });

        const existingContract = await queryRunner.manager.findOneBy(Contract, {
          name: contract,
        });

        if (existingCompany && existingContract) {
          const newOffer: NewOfferDto = {
            title: position,
            contract: existingContract,
            company: existingCompany,
            location,
            description: `<p>${description}</p>
            <p>${role.content}</p>
            <br/>
            <ul>
            ${role.items.map((item: string) => `<li>${item}</li>`).join('')}
            </ul>
            <br/>
            <p>\t${requirements.content}</p>
            <br/>
            <ul>
            ${requirements.items
              .map((item: string) => `<li>${item}</li>`)
              .join('')}
            </ul>`,
            unremovable: true,
            createdAt: Math.floor(new Date().getTime() / 1000),
            createdBy: 1,
          };
          const { id } = await offerRepository.save(newOffer);
          this.defaultOffersIds.push(id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const nowTimestamp = Math.floor(new Date().getTime() / 1000);

    // add default companies
    await queryRunner.query(
      `INSERT INTO company VALUES
       (1, 'Scoot', 'scoot.svg', ${nowTimestamp}, 1, null, null),
       (2, 'Blogr', 'blogr.svg', ${nowTimestamp}, 1, null, null),
       (3, 'Vector', 'vector.svg', ${nowTimestamp}, 1, null, null),
       (4, 'Office Lite', 'officelite.svg', ${nowTimestamp}, 1, null, null),
       (5, 'Pod', 'pod.svg', ${nowTimestamp}, 1, null, null),
       (6, 'Creative', 'creative.svg', ${nowTimestamp}, 1, null, null),
       (7, 'Pomodoro', 'pomodoro.svg', ${nowTimestamp}, 1, null, null),
       (8, 'Maker', 'maker.svg', ${nowTimestamp}, 1, null, null),
       (9, 'Coffeeroasters', 'coffeeroasters.svg', ${nowTimestamp}, 1, null, null),
       (10, 'Mastercraft', 'mastercraft.svg', ${nowTimestamp}, 1, null, null),
       (11, 'Crowdfund', 'crowdfund.svg', ${nowTimestamp}, 1, null, null),
       (12, 'Typemaster', 'typemaster.svg', ${nowTimestamp}, 1, null, null)`,
    );

    // add default contracts
    await queryRunner.query(
      `INSERT INTO contract VALUES
           (1, 'Full Time', ${nowTimestamp}, 1, null, null),
           (2, 'Part Time', ${nowTimestamp}, 1, null, null),
           (3, 'Freelance', ${nowTimestamp}, 1, null, null),
           (4, '1/2 Time', ${nowTimestamp}, 1, null, null),
           (5, '1/3 Time', ${nowTimestamp}, 1, null, null),
           (6, '1/4 Time', ${nowTimestamp}, 1, null, null)`,
    );

    await this.importDefaultOffers(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // remove defaults companies
    await queryRunner.query(`DELETE FROM company WHERE id <= 12`);
    // remove defaults contracs
    await queryRunner.query(`DELETE FROM contract WHERE id <= 6`);
    // remove defaults offers
    await queryRunner.query(
      `DELETE FROM offer WHERE id IN (${this.defaultOffersIds.join(',')})`,
    );
  }
}
