import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Lodging } from './entities/lodging.entity';
import { CreateLodgingDto } from './dto/create-lodging.dto';
import { UpdateLodgingDto } from './dto/update-lodging.dto';
import { LodgingDto } from './dto/lodging.dto';
import { Adresse } from '../address/entities/adresse.entity';

@Injectable()
export class LodgingService {
  constructor(
    @InjectRepository(Lodging)
    private readonly lodgingRepository: Repository<Lodging>,
  ) {}

  async findAll(): Promise<LodgingDto[]> {
    const entities = await this.lodgingRepository.find({
      relations: ['adresse', 'logers', 'logers.user'],
    });

    return entities.map((entity) => this.toDTO(entity));
  }

  async findById(id: number): Promise<LodgingDto> {
    const entity = await this.lodgingRepository.findOne({
      where: { id },
      relations: ['adresse', 'logers', 'logers.user'],
    });

    if (!entity) {
      throw new NotFoundException(`Logement avec l'id ${id} non trouvé`);
    }

    return this.toDTO(entity);
  }

  async create(dto: CreateLodgingDto): Promise<LodgingDto> {
    const entity = this.lodgingRepository.create({
      estLoue: dto.estLoue,
      prixLoyer: dto.prixLoyer,
      superficie: dto.superficie,
      nbPiece: dto.nbPiece,
      adresse: { id: dto.adresseId } as Adresse,
    });

    const saved = await this.lodgingRepository.save(entity);
    return this.toDTO(saved);
  }

  async update(id: number, dto: UpdateLodgingDto): Promise<LodgingDto> {
    const entity = await this.lodgingRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`Logement avec l'id ${id} non trouvé`);
    }

    entity.estLoue = dto.estLoue ?? entity.estLoue;
    entity.prixLoyer = dto.prixLoyer ?? entity.prixLoyer;
    entity.superficie = dto.superficie ?? entity.superficie;
    entity.nbPiece = dto.nbPiece ?? entity.nbPiece;

    if (dto.adresseId) {
      entity.adresse = { id: dto.adresseId } as Adresse;
    }

    const updated = await this.lodgingRepository.save(entity);
    return this.toDTO(updated);
  }

  async delete(id: number): Promise<void> {
    const result = await this.lodgingRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Logement avec l'id ${id} non trouvé`);
    }
  }

  private toDTO(entity: Lodging): LodgingDto {
    return {
      id: entity.id,
      estLoue: entity.estLoue,
      prixLoyer: entity.prixLoyer,
      superficie: entity.superficie,
      nbPiece: entity.nbPiece,
      adresseId: entity.adresse?.id,
      users: entity.logers?.map((loger) => ({
        userId: loger.user.id,
        statut: loger.statut,
      })) ?? [],
    };
  }
}
