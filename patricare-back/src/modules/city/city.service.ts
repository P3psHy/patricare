import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './entities/city.entity';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { CityFilter, ICityService } from './city-service.interface';

@Injectable()
export class CityService implements ICityService {
  constructor(@InjectRepository(City) private readonly cityRepo: Repository<City>) {}

  async create(dto: CreateCityDto): Promise<City> {
    const city = this.cityRepo.create(dto);
    return this.cityRepo.save(city);
  }

  async findAll(filter?: CityFilter): Promise<City[]> {
    const qb = this.cityRepo.createQueryBuilder('ville').leftJoinAndSelect('ville.adresses', 'adresses');

    if (filter?.nom) qb.andWhere('LOWER(ville.nom) LIKE LOWER(:nom)', { nom: `%${filter.nom}%` });
    if (filter?.codePostal) qb.andWhere('ville.codePostal = :codePostal', { codePostal: filter.codePostal });
    if (filter?.departement) qb.andWhere('LOWER(ville.departement) = LOWER(:departement)', { departement: filter.departement });
    if (filter?.region) qb.andWhere('LOWER(ville.region) = LOWER(:region)', { region: filter.region });

    if (filter?.limit) qb.take(filter.limit);
    if (filter?.offset) qb.skip(filter.offset);

    return qb.getMany();
  }

  async findOne(id: number): Promise<City> {
    const city = await this.cityRepo.findOne({ where: { id }, relations: ['adresses'] });
    if (!city) throw new NotFoundException('Ville introuvable');
    return city;
  }

  async update(id: number, dto: UpdateCityDto): Promise<City> {
    const city = await this.cityRepo.findOne({ where: { id } });
    if (!city) throw new NotFoundException('Ville introuvable');
    Object.assign(city, dto);
    return this.cityRepo.save(city);
  }

  async remove(id: number): Promise<void> {
    const res = await this.cityRepo.delete(id);
    if (!res.affected) throw new NotFoundException('Ville introuvable');
  }
}

