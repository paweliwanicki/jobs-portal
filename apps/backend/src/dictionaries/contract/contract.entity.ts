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
export class Contract {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  createdAt: number;

  @Column()
  createdBy: number;

  @Column({ nullable: true })
  modifiedBy: number;

  @Column({ nullable: true })
  modifiedAt: number;

  @OneToMany(() => Offer, (offer) => offer.contract)
  offer: Offer[];

  @AfterInsert()
  logInsert() {
    console.log('Contract is created with id ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Contract is updated with id ', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Contract is removed with id ', this.id);
  }
}
