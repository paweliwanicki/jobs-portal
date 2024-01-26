import { Company } from '../dictionaries/company/company.entity';
import { Contract } from '../dictionaries/contract/contract.entity';
import {
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  location: string;

  @Column()
  createdAt: number;

  @Column()
  createdBy: number;

  @Column({ nullable: true })
  modifiedBy: number;

  @Column({ nullable: true })
  modifiedAt: number;

  @Column({ default: false })
  archived: boolean;

  @Column({ default: false })
  unremovable: boolean;

  @ManyToOne(() => Company, (company) => company.offer)
  @JoinColumn()
  company: Company;

  @ManyToOne(() => Contract, (contract) => contract.offer)
  @JoinColumn()
  contract: Contract;

  @AfterInsert()
  logInsert() {
    console.log('Offer is created with id ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Offer is updated with id ', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Offer is removed with id ', this.id);
  }
}
