import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { Adresse } from "../../modules/address/entities/adresse.entity";
import { User } from "../../modules/user/user.entity";

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
