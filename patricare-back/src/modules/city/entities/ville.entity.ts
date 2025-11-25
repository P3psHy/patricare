import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Adresse } from "../../address/entities/adresse.entity";

@Entity()
export class Ville {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nom: string;

    @Column()
    codePostal: string;

    @Column()
    departement: string;

    @Column()
    region: string;

    @OneToMany(() => Adresse, adresse => adresse.ville)
    adresses: Adresse[];
}
