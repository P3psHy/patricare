import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { Adresse } from "./adresse.entity";
import { User } from "./user.entity";

@Entity()
export class Logement {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.logements)
    owner: User;

    @ManyToOne(() => Adresse, adresse => adresse.logements)
    adresse: Adresse;

    @ManyToOne(() => Logement, logement => logement.documents)
    documents: Document[];
}
