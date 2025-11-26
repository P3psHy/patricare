import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Adresse } from '../../address/entities/adresse.entity';

@Entity('logements')
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

  @ManyToOne(() => Adresse, (adresse) => adresse.logements, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'adresseId' })
  adresse!: Adresse;

}
