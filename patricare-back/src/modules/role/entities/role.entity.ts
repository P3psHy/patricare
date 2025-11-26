import { Column, Entity, OneToMany } from "typeorm/browser";
import { PrimaryGeneratedColumn } from "typeorm/browser";
import { User } from "../../modules/user/user.entity";

@Entity()
export class Role {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    role: string;

    @OneToMany(() => User, user => user.role)
    users: User[];
}
