import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Lodging } from './entities/lodging.entity';

@Injectable()
export class LodgingService {
  constructor(
    @InjectRepository(Lodging)
    private readonly lodgingRepository: Repository<Lodging>,
  ) {}

  async findAll(): Promise<LodgingDTO[]> {
    const entities = await this.lodgingRepository.find({
      relations: ['adresse', 'owner', 'tenant'],
    });
    return entities.map(entity => this.toDTO(entity));
  }

  async findById(id: number): Promise<LodgingDTO> {
    const entity = await this.lodgingRepository.findOne({
      where: { id },
      relations: ['adresse', 'owner', 'tenant'],
    });
    if (!entity) {
      throw new NotFoundException(`Logement avec l'id ${id} non trouvé`);
    }
    return this.toDTO(entity);
  }

  async create(dto: LodgingDTO): Promise<LodgingDTO> {
    const newEntity = this.lodgingRepository.create({
      estLoue: dto.estLoue,
      prixLoyer: dto.prixLoyer,
      superficie: dto.superficie,
      nbPiece: dto.nbPiece,
      adresse: { id: dto.adresseId } as any,
      owner: { id: dto.ownerId } as any,
      tenant: dto.tenantId ? { id: dto.tenantId } as any : null,
    });
    const saved = await this.lodgingRepository.save(newEntity);
    return this.toDTO(saved);
  }

  async update(id: number, dto: LodgingDTO): Promise<LodgingDTO> {
    const entity = await this.lodgingRepository.findOne({
      where: { id },
    });
    if (!entity) {
      throw new NotFoundException(`Logement avec l'id ${id} non trouvé`);
    }

    entity.estLoue = dto.estLoue;
    entity.prixLoyer = dto.prixLoyer;
    entity.superficie = dto.superficie;
    entity.nbPiece = dto.nbPiece;
    entity.adresse = { id: dto.adresseId } as any;
    entity.owner = { id: dto.ownerId } as any;
    entity.tenant = dto.tenantId ? ({ id: dto.tenantId } as any) : null;

    const updated = await this.lodgingRepository.save(entity);
    return this.toDTO(updated);
  }

  async delete(id: number): Promise<void> {
    const result = await this.lodgingRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Logement avec l'id ${id} non trouvé`);
    }
  }

  private toDTO(entity: Lodging): LodgingDTO {
    return {
      id: entity.id,
      estLoue: entity.estLoue,
      prixLoyer: entity.prixLoyer,
      superficie: entity.superficie,
      nbPiece: entity.nbPiece,
      adresseId: entity.adresse.id,
      ownerId: entity.owner.id,
      tenantId: entity.tenant ? entity.tenant.id : undefined,
    };
  }
}
