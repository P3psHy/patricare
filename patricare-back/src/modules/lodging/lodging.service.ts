import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lodging } from './entities/lodging.entity';
import { Adresse } from '../address/entities/address.entity';
import { CreateLodgingDto } from './dto/create-lodging.dto';
import { UpdateLodgingDto } from './dto/update-lodging.dto';
import { ILodgingService, LodgingFilter } from './lodging-service.interface';

@Injectable()
export class LodgingService implements ILodgingService {
  constructor(
    @InjectRepository(Lodging) private readonly lodgingRepo: Repository<Lodging>,
    @InjectRepository(Adresse) private readonly adresseRepo: Repository<Adresse>,
  ) {}

  async create(dto: CreateLodgingDto): Promise<Lodging> {
    const adresse = await this.adresseRepo.findOne({ where: { id: dto.adresseId } });
    if (!adresse) throw new NotFoundException('Adresse introuvable');
    const lodging = this.lodgingRepo.create({ ...dto, adresse });
    return this.lodgingRepo.save(lodging);
  }

  async findAll(filter?: LodgingFilter): Promise<Lodging[]> {
    const qb = this.lodgingRepo.createQueryBuilder('l').leftJoinAndSelect('l.adresse', 'adresse');

    if (filter?.estLoue !== undefined) qb.andWhere('l.estLoue = :estLoue', { estLoue: filter.estLoue });
    if (filter?.minPrice !== undefined) qb.andWhere('l.prixLoyer >= :minPrice', { minPrice: filter.minPrice });
    if (filter?.maxPrice !== undefined) qb.andWhere('l.prixLoyer <= :maxPrice', { maxPrice: filter.maxPrice });
    if (filter?.minSurface !== undefined) qb.andWhere('l.superficie >= :minSurface', { minSurface: filter.minSurface });
    if (filter?.maxSurface !== undefined) qb.andWhere('l.superficie <= :maxSurface', { maxSurface: filter.maxSurface });
    if (filter?.minNbPiece !== undefined) qb.andWhere('l.nbPiece >= :minNb', { minNb: filter.minNbPiece });
    if (filter?.maxNbPiece !== undefined) qb.andWhere('l.nbPiece <= :maxNb', { maxNb: filter.maxNbPiece });
    if (filter?.adresseId !== undefined) qb.andWhere('adresse.id = :adresseId', { adresseId: filter.adresseId });

    if (filter?.limit) qb.take(filter.limit);
    if (filter?.offset) qb.skip(filter.offset);

    return qb.getMany();
  }

  async findOne(id: number): Promise<Lodging | null> {
    const lodging = await this.lodgingRepo.findOne({ where: { id }, relations: ['adresse'] });
    if (!lodging) throw new NotFoundException('Logement introuvable');
    return lodging;
  }

  async update(id: number, dto: UpdateLodgingDto): Promise<Lodging> {
    const lodging = await this.lodgingRepo.findOne({ where: { id }, relations: ['adresse'] });
    if (!lodging) throw new NotFoundException('Logement introuvable');

    if (dto.adresseId) {
      const adresse = await this.adresseRepo.findOne({ where: { id: dto.adresseId } });
      if (!adresse) throw new NotFoundException('Adresse introuvable');
      lodging.adresse = adresse;
    }
    Object.assign(lodging, dto);
    return this.lodgingRepo.save(lodging);
  }

  async remove(id: number): Promise<void> {
    const res = await this.lodgingRepo.delete(id);
    if (res.affected === 0) throw new NotFoundException('Logement introuvable');
  }

  async setRentStatus(id: number, estLoue: boolean): Promise<Lodging> {
    const lodging = await this.lodgingRepo.findOne({ where: { id } });
    if (!lodging) throw new NotFoundException('Logement introuvable');
    lodging.estLoue = estLoue;
    return this.lodgingRepo.save(lodging);
  }

  async findByAddressId(adresseId: number): Promise<Lodging[]> {
    return this.lodgingRepo.find({ where: { adresse: { id: adresseId } }, relations: ['adresse'] });
  }
}