import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { User } from '../user/entities/user.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleFilter, IRoleService } from './role-service.interface';

@Injectable()
export class RoleService implements IRoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateRoleDto): Promise<Role> {
    const exists = await this.roleRepo.findOne({ where: { role: dto.role } });
    if (exists) throw new ConflictException('Role already exists');

    const role = this.roleRepo.create({ role: dto.role } as Partial<Role>);
    const saved = await this.roleRepo.save(role);
    return this.findOne(saved.id);
  }

  async findAll(filter?: RoleFilter): Promise<Role[]> {
    const qb = this.roleRepo.createQueryBuilder('r').leftJoinAndSelect('r.users', 'users');

    if (filter?.role) qb.andWhere('r.role LIKE :role', { role: `%${filter.role}%` });
    if (filter?.limit) qb.take(filter.limit);
    if (filter?.offset) qb.skip(filter.offset);

    return qb.getMany();
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepo.findOne({ where: { id }, relations: ['users'] });
    if (!role) throw new NotFoundException('Role introuvable');
    return role;
  }

  async update(id: number, dto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    if (dto.role !== undefined && dto.role !== role.role) {
      const exists = await this.roleRepo.findOne({ where: { role: dto.role } });
      if (exists) throw new ConflictException('Role already exists');
      role.role = dto.role;
    }

    const saved = await this.roleRepo.save(role);
    return this.findOne(saved.id);
  }

  async remove(id: number): Promise<void> {
    const usersCount = await this.userRepo.count({ where: { roleId: id } });
    if (usersCount > 0) {
      throw new BadRequestException('Cannot delete role assigned to users');
    }
    const res = await this.roleRepo.delete(id);
    if (res.affected === 0) throw new NotFoundException('Role introuvable');
  }
}