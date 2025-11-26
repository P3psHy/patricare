import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Address } from "../../address/entities/address.entity";

@Entity()
export class City {
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

    @OneToMany(() => Address, adresse => adresse.ville)
    adresses: Address[];
}
