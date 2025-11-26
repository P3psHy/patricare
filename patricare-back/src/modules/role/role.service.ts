import { Injectable } from '@nestjs/common';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  private readonly roles = new Map<number, Role>();
  private idCounter = 1;

  constructor() {
    this.initializeRoles();
  }

  private initializeRoles(): void {
    this.create({ libelle: 'Administrateur' });
    this.create({ libelle: 'Propriétaire' });
    this.create({ libelle: 'Locataire' });
    this.create({ libelle: 'Gestionnaire' });
  }

  create(roleData: Partial<Role>): Role {
    const role = new Role(roleData);
    role.id = this.idCounter++;
    this.roles.set(role.id, role);
    return role;
  }

  findAll(): Role[] {
    return [...this.roles.values()];
  }

  findOne(id: number): Role | undefined {
    return this.roles.get(id);
  }

  update(id: number, roleData: Partial<Role>): Role | undefined {
    const role = this.roles.get(id);
    if (!role) {
      return undefined;
    }

    Object.assign(role, roleData);
    this.roles.set(id, role);
    return role;
  }

  delete(id: number): boolean {
    return this.roles.delete(id);
  }
}
