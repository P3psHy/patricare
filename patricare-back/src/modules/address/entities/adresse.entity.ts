import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Logement } from "../../../migrations/init/logement.entity";
import { Ville } from "../../city/entities/ville.entity";

@Entity()
export class Adresse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  rue: string;

  @ManyToOne(() => Ville, (ville) => ville.adresses)
  ville: Ville;

  @OneToMany(() => Logement, (logement) => logement.adresse)
  logements: Logement[];
}
