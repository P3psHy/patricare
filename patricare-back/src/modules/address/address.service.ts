import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Adresse } from './entities/address.entity';
import { City } from '../city/entities/city.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressFilter, IAddressService } from './address-service.interface';

@Injectable()
export class AddressService implements IAddressService {
  constructor(
    @InjectRepository(Adresse) private readonly addressRepo: Repository<Adresse>,
    @InjectRepository(City) private readonly cityRepo: Repository<City>,
  ) {}

  async create(dto: CreateAddressDto): Promise<Adresse> {
    const address = this.addressRepo.create({ rue: dto.rue });

    if (dto.villeId !== undefined) {
      const city = await this.cityRepo.findOne({ where: { id: dto.villeId } });
      if (!city) throw new NotFoundException('Ville introuvable');
      address.ville = city;
    }

    return this.addressRepo.save(address);
  }

  async findAll(filter?: AddressFilter): Promise<Adresse[]> {
    const qb = this.addressRepo.createQueryBuilder('adresse').leftJoinAndSelect('adresse.ville', 'ville');

    if (filter?.rue) qb.andWhere('LOWER(adresse.rue) LIKE LOWER(:rue)', { rue: `%${filter.rue}%` });
    if (filter?.villeId !== undefined) qb.andWhere('ville.id = :villeId', { villeId: filter.villeId });

    if (filter?.limit) qb.take(filter.limit);
    if (filter?.offset) qb.skip(filter.offset);

    return qb.getMany();
  }

  async findOne(id: number): Promise<Adresse> {
    const address = await this.addressRepo.findOne({ where: { id }, relations: ['ville'] });
    if (!address) throw new NotFoundException('Adresse introuvable');
    return address;
  }

  async update(id: number, dto: UpdateAddressDto): Promise<Adresse> {
    const address = await this.addressRepo.findOne({ where: { id }, relations: ['ville'] });
    if (!address) throw new NotFoundException('Adresse introuvable');

    if (dto.villeId !== undefined) {
      const city = await this.cityRepo.findOne({ where: { id: dto.villeId } });
      if (!city) throw new NotFoundException('Ville introuvable');
      address.ville = city;
    }

    Object.assign(address, dto.rue !== undefined ? { rue: dto.rue } : {});

    return this.addressRepo.save(address);
  }

  async remove(id: number): Promise<void> {
    const res = await this.addressRepo.delete(id);
    if (!res.affected) throw new NotFoundException('Adresse introuvable');
  }

  async findByCityId(villeId: number): Promise<Adresse[]> {
    return this.addressRepo.find({ where: { ville: { id: villeId } }, relations: ['ville'] });
  }
}

