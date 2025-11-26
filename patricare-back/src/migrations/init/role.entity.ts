import { Column, Entity, OneToMany } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Role {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    role: string;

    @OneToMany(() => User, user => user.role)
    users: User[];
}
