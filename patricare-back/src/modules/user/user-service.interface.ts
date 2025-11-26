import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export interface IUserFilter {
  roleId?: number;
}

export interface IUserService {
  create(dto: CreateUserDto): Promise<User>;
  findAll(filter?: IUserFilter): Promise<User[]>;
  findOne(id: number): Promise<User>;
  update(id: number, dto: UpdateUserDto): Promise<User>;
  remove(id: number): Promise<void>;
  setHabitation(id: number, lodgingId: number): Promise<User>;
  unsetHabitation(id: number): Promise<User>;
}