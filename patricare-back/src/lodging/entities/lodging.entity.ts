import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  //ManyToOne,
  //JoinColumn,
} from 'typeorm';
//import { User } from '../user/user.entity';
//import { Adresse } from '../adresse/adresse.entity';

@Entity()
export class Lodging {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: false })
  estLoue!: boolean;

  @Column('float')
  prixLoyer!: number;

  @Column('float')
  superficie!: number;

  @Column('int')
  nbPiece!: number;
/*@ManyToOne(() => Adresse, adresse => adresse.logements, { eager: true })
  @JoinColumn({ name: 'adresseId' })
  adresse!: Adresse;

  @ManyToOne(() => User, user => user.ownedLogements, { eager: true })
  @JoinColumn({ name: 'ownerId' })
  owner!: User;

  @ManyToOne(() => User, user => user.rentedLogements, { nullable: true, eager: true })
  @JoinColumn({ name: 'tenantId' })
  tenant?: User;*/
}
