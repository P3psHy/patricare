import { Injectable } from '@nestjs/common';
import { Adresse } from './entities/adresse.entity';

@Injectable()
export class AddressService {
    private addresses = new Map<number, Adresse>();
    private idCounter = 1;

    constructor() {
        this.initializeAddresses();
    }

    private initializeAddresses(): void {
        this.create({ numero: '123', rue: 'Rue de la Paix', complement: 'Apt 5', villeId: 1 });
        this.create({ numero: '456', rue: 'Avenue des Champs', complement: '', villeId: 1 });
        this.create({ numero: '789', rue: 'Boulevard Saint-Germain', complement: 'Suite 200', villeId: 1 });
        this.create({ numero: '101', rue: 'Rue de la République', complement: '', villeId: 2 });
    }

    create(addressData: Partial<Adresse>): Adresse {
        const address = new Adresse(addressData);
        address.id = this.idCounter++;
        this.addresses.set(address.id, address);
        return address;
    }

    findAll(): Adresse[] {
        return Array.from(this.addresses.values());
    }

    findOne(id: number): Adresse | undefined {
        return this.addresses.get(id);
    }

    update(id: number, addressData: Partial<Adresse>): Adresse | undefined {
        const address = this.addresses.get(id);
        if (address) {
            Object.assign(address, addressData);
            this.addresses.set(id, address);
            return address;
        }
        return undefined;
    }

    delete(id: number): boolean {
        return this.addresses.delete(id);
    }
}