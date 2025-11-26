import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Lodging } from '../../lodging/entities/lodging.entity';
import { City } from '../../city/entities/city.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  rue: string;

  @ManyToOne(() => City, (ville) => ville.adresses, { nullable: true })
  ville?: City | null;

  @OneToMany(() => Lodging, (logement) => logement.adresse)
  logements: Lodging[];
}
