import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Logement } from "./logement.entity";
import { Ville } from "./ville.entity";

@Entity()
export class Adresse {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    rue: string;

    @ManyToOne(() => Ville, ville => ville.adresses)
    ville: Ville;

    @OneToMany(() => Logement, logement => logement.adresse)
    logements: Logement[];
}
