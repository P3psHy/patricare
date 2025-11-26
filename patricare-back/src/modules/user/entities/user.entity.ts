// ...existing code...
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { Lodging } from '../../lodging/entities/lodging.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  // relation vers Role
  @ManyToOne(() => Role, (r) => r.users, { nullable: false })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column()
  roleId: number;

  // relation vers Lodging (nullable)
  @ManyToOne(() => Lodging, (l) => l.locataires, { nullable: true })
  @JoinColumn({ name: 'logementId' })
  logementHabite: Lodging | null;

  @Column({ nullable: true })
  logementId?: number;
}