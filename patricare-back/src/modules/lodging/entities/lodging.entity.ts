import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Adresse } from '../../address/entities/adresse.entity';
import { User } from '../../user/entities/user.entity';

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

  // === propriétaire (1 user propriétaire par logement) ===
  @ManyToOne(() => User, (user) => user.logementId, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'proprietaireId' })
  proprietaire!: User;

  // === locataires (plusieurs users peuvent être locataires); OneToMany côté Lodging ===
  @OneToMany(() => User, (user) => user.logementHabite, { eager: true })
  locataires!: User[];
}