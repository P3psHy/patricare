import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IRoleService } from './role-service.interface';
import { User } from '../user/entities/user.entity';

@Injectable()
export class RoleService implements IRoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateRoleDto): Promise<Role> {
    const exists = await this.roleRepo.findOne({ where: { role: dto.role } });
    if (exists) throw new ConflictException('Role already exists');
    const role = this.roleRepo.create(dto as any);
    return this.roleRepo.save(role);
  }

  async findAll(filter?: { role?: string; limit?: number; offset?: number }): Promise<Role[]> {
    const qb = this.roleRepo.createQueryBuilder('r').leftJoinAndSelect('r.users', 'users');
    if (filter?.role) qb.andWhere('r.role ILIKE :role', { role: `%${filter.role}%` });
    if (filter?.limit) qb.take(filter.limit);
    if (filter?.offset) qb.skip(filter.offset);
    return qb.getMany();
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepo.findOne({ where: { id }, relations: ['users'] });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async update(id: number, dto: UpdateRoleDto): Promise<Role> {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Role not found');

    if (dto.role && dto.role !== role.role) {
      const exists = await this.roleRepo.findOne({ where: { role: dto.role } });
      if (exists) throw new ConflictException('Role already exists');
    }

    Object.assign(role, dto);
    return this.roleRepo.save(role);
  }

  async remove(id: number): Promise<void> {
    const role = await this.roleRepo.findOne({ where: { id }, relations: ['users'] });
    if (!role) throw new NotFoundException('Role not found');

    // Prevent deletion if users are assigned to this role — adapt to desired behavior
    if (role.users && role.users.length > 0) {
      throw new BadRequestException('Cannot delete role with assigned users');
    }

    await this.roleRepo.delete(id);
  }
}