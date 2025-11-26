import { Injectable } from '@nestjs/common';
import { Ville } from './entities/ville.entity';

@Injectable()
export class CityService {
    private cities = new Map<number, Ville>();
    private idCounter = 1;

    constructor() {
        this.initializeCities();
    }

    private initializeCities(): void {
        this.create({ nom: 'Paris', codePostal: '75001', departement: '75', region: 'Île-de-France' });
        this.create({ nom: 'Lyon', codePostal: '69001', departement: '69', region: 'Auvergne-Rhône-Alpes' });
        this.create({ nom: 'Marseille', codePostal: '13001', departement: '13', region: 'Provence-Alpes-Côte d\'Azur' });
        this.create({ nom: 'Toulouse', codePostal: '31000', departement: '31', region: 'Occitanie' });
    }

    create(cityData: Partial<Ville>): Ville {
        const city = new Ville(cityData);
        city.id = this.idCounter++;
        this.cities.set(city.id, city);
        return city;
    }

    findAll(): Ville[] {
        return Array.from(this.cities.values());
    }

    findOne(id: number): Ville | undefined {
        return this.cities.get(id);
    }

    update(id: number, cityData: Partial<Ville>): Ville | undefined {
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