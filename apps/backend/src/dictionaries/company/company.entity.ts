import { Offer } from '../../offers/offer.entity';
import {
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  logoFileName: string;

  @Column()
  createdAt: number;

  @Column()
  createdBy: number;

  @Column({ nullable: true })
  modifiedBy: number;

  @Column({ nullable: true })
  modifiedAt: number;

  @OneToMany(() => Offer, (offer) => offer.company)
  offer: Offer;

  @AfterInsert()
  logInsert() {
    console.log('Company is created with id ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Company is updated with id ', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Company is removed with id ', this.id);
  }
}
