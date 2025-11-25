import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Logement } from "../../migrations/init/logement.entity";
import { Role } from "../../migrations/init/role.entity";
import { Documents } from "./document.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    firstname: string;

    @Column({ length: 50 })
    lastname: string;

    @ManyToOne(() => Role, role => role.users, { eager: true })
    role: Role;

    @OneToMany(() => Logement, logement => logement.owner)
    logements: Logement[];

    @OneToMany(() => Documents, doc => doc.user)
    documents: Document[];
}
