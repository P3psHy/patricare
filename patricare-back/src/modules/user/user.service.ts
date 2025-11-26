import { Injectable, NotFoundException, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { Lodging } from '../lodging/entities/lodging.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    @InjectRepository(Lodging) private readonly lodgingRepo: Repository<Lodging>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const exists = await this.userRepo.findOne({ where: { email: dto.mail } });
    if (exists) throw new ConflictException('Email already in use');

    const role = await this.roleRepo.findOne({ where: { id: dto.roleId } });
    if (!role) throw new NotFoundException('Role introuvable');

    let logementHabite: Lodging | null = null;
    if (dto.logementId != null) {
      const found = await this.lodgingRepo.findOne({ where: { id: dto.logementId } });
      if (!found) throw new NotFoundException('Logement introuvable');
      logementHabite = found;
    }

    const user: User = this.userRepo.create({
      email: dto.mail,
      firstname: dto.firstname,
      lastname: dto.lastname,
      telephone: dto.telephone,
      password: dto.password,
      role,
      roleId: role.id,
      logementHabite: logementHabite ?? null,
      logementId: logementHabite?.id ?? null,
    } as Partial<User>);

    const saved: User = await this.userRepo.save(user);
    const final = await this.userRepo.findOne({
      where: { id: saved.id },
      relations: ['role', 'logementHabite'],
    });
    if (!final) throw new InternalServerErrorException('User created but could not be reloaded');
    return final;
  }

  async findAll(filter?: { roleId?: number }): Promise<User[]> {
    const qb = this.userRepo.createQueryBuilder('u')
      .leftJoinAndSelect('u.role', 'role')
      .leftJoinAndSelect('u.logementHabite', 'logement');

    if (filter?.roleId) qb.andWhere('role.id = :roleId', { roleId: filter.roleId });
    return qb.getMany();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['role', 'logementHabite'],
    });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['role', 'logementHabite'],
    });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    if ((dto as any).roleId !== undefined && (dto as any).roleId !== null) {
      const role = await this.roleRepo.findOne({ where: { id: (dto as any).roleId } });
      if (!role) throw new NotFoundException('Role introuvable');
      user.role = role;
      user.roleId = role.id;
    }

    if ((dto as any).logementId !== undefined) {
      if ((dto as any).logementId === null) {
        user.logementHabite = null;
        user.logementId = undefined;
      } else {
        const lodging = await this.lodgingRepo.findOne({ where: { id: (dto as any).logementId } });
        if (!lodging) throw new NotFoundException('Logement introuvable');
        user.logementHabite = lodging;
        user.logementId = lodging.id;
      }
    }

    if ((dto as any).mail) user.email = (dto as any).mail;
    if ((dto as any).firstname !== undefined) (user as any).firstname = (dto as any).firstname;
    if ((dto as any).lastname !== undefined) (user as any).lastname = (dto as any).lastname;
    if ((dto as any).telephone !== undefined) (user as any).telephone = (dto as any).telephone;
    if ((dto as any).password !== undefined) (user as any).password = (dto as any).password;

    const saved: User = await this.userRepo.save(user);
    return this.findOne(saved.id);
  }

  async remove(id: number): Promise<void> {
    const res = await this.userRepo.delete(id);
    if (res.affected === 0) throw new NotFoundException('Utilisateur introuvable');
  }

  async setHabitation(id: number, lodgingId: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id }, relations: ['logementHabite'] });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    const lodging = await this.lodgingRepo.findOne({ where: { id: lodgingId } });
    if (!lodging) throw new NotFoundException('Logement introuvable');

    // Prevent if user already lives elsewhere and you don't want automatic switch:
    if (user.logementHabite && user.logementHabite.id !== lodgingId) {
      throw new BadRequestException('Utilisateur habite déjà un autre logement');
    }

    user.logementHabite = lodging;
    user.logementId = lodging.id;
    const saved: User = await this.userRepo.save(user);
    return this.findOne(saved.id);
  }

  async unsetHabitation(id: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id }, relations: ['logementHabite'] });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    user.logementHabite = null;
    user.logementId = undefined;
    const saved: User = await this.userRepo.save(user);
    return this.findOne(saved.id);
  }
}