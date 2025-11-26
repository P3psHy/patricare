import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Logement } from "./logement.entity";
import { User } from "./user.entity";

@Entity()
export class Documents {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    nom: string;

    @Column({ length: 50 })
    type: string;

    @Column({ type: 'datetime' })
    dateModification: Date;

    @ManyToOne(() => User, user => user.documents)
    user: User;

    @ManyToOne(() => Logement, logement => logement.documents)
    logement: Logement;
}
