import { Injectable } from '@nestjs/common';
import { Lodging } from './entities/lodging.entity';

@Injectable()
export class LodgingService {
  private lodgings = new Map<number, Lodging>();
  private idCounter = 1;

  constructor() {
    this.initializeLodgings();
  }

  private initializeLodgings(): void {
    this.create({
      estLoue: true,
      prixLoyer: 1200,
      superficie: 65,
      nbPiece: 2,
      adresseId: 1,
      description: 'Bel appartement avec vue sur la Seine',
    });
    this.create({
      estLoue: false,
      prixLoyer: 2000,
      superficie: 120,
      nbPiece: 4,
      adresseId: 2,
      description: 'Spacieux T4 au cœur de Paris',
    });
    this.create({
      estLoue: true,
      prixLoyer: 800,
      superficie: 35,
      nbPiece: 1,
      adresseId: 3,
      description: 'Studio cosy proche du métro',
    });
  }

  create(lodgingData: Partial<Lodging>): Lodging {
    const lodging = new Lodging(lodgingData);
    lodging.id = this.idCounter++;
    this.lodgings.set(lodging.id, lodging);
    return lodging;
  }

  findAll(): Lodging[] {
    return Array.from(this.lodgings.values());
  }

  findOne(id: number): Lodging | undefined {
    return this.lodgings.get(id);
  }

  update(id: number, lodgingData: Partial<Lodging>): Lodging | undefined {
    const lodging = this.lodgings.get(id);
    if (lodging) {
      Object.assign(lodging, lodgingData);
      this.lodgings.set(id, lodging);
      return lodging;
    }
    return undefined;
  }

  delete(id: number): boolean {
    return this.lodgings.delete(id);
  }
}
