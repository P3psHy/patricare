import { Injectable } from '@nestjs/common';
import { City } from './entities/city.entity';

@Injectable()
export class CityService {
  private cities = new Map<number, City>();
  private idCounter = 1;

  constructor() {
    this.initializeCities();
  }

  private initializeCities(): void {
    this.create({
      nom: 'Paris',
      codePostal: '75001',
      departement: '75',
      region: 'Île-de-France',
    });

    this.create({
      nom: 'Lyon',
      codePostal: '69001',
      departement: '69',
      region: 'Auvergne-Rhône-Alpes',
    });

    this.create({
      nom: 'Marseille',
      codePostal: '13001',
      departement: '13',
      region: "Provence-Alpes-Côte d'Azur",
    });

    this.create({
      nom: 'Toulouse',
      codePostal: '31000',
      departement: '31',
      region: 'Occitanie',
    });
  }

  create(cityData: Partial<City>): City {
    const city = new City(cityData);
    city.id = this.idCounter++;
    this.cities.set(city.id, city);
    return city;
  }

  findAll(): City[] {
    return Array.from(this.cities.values());
  }

  findOne(id: number): City | undefined {
    return this.cities.get(id);
  }

  update(id: number, cityData: Partial<City>): City | undefined {
    const city = this.cities.get(id);
    if (city) {
      Object.assign(city, cityData);
      this.cities.set(id, city);
      return city;
    }
    return undefined;
  }

  delete(id: number): boolean {
    return this.cities.delete(id);
  }
}
