import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

export interface RoleFilter {
  role?: string;
  limit?: number;
  offset?: number;
}

export interface IRoleService {
  create(dto: CreateRoleDto): Promise<Role>;
  findAll(filter?: RoleFilter): Promise<Role[]>;
  findOne(id: number): Promise<Role>;
  update(id: number, dto: UpdateRoleDto): Promise<Role>;
  remove(id: number): Promise<void>;
}