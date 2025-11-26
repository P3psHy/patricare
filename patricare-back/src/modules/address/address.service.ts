import { Injectable } from '@nestjs/common';
import { Address } from './entities/adresse.entity';

@Injectable()
export class AddressService {
  private readonly addresses = new Map<number, Address>();
  private idCounter = 1;

  constructor() {
    this.initializeAddresses();
  }

  private initializeAddresses(): void {
    this.create({
      numero: '123',
      rue: 'Rue de la Paix',
      complement: 'Apt 5',
      villeId: 1,
    });

    this.create({
      numero: '456',
      rue: 'Avenue des Champs',
      complement: '',
      villeId: 1,
    });

    this.create({
      numero: '789',
      rue: 'Boulevard Saint-Germain',
      complement: 'Suite 200',
      villeId: 1,
    });

    this.create({
      numero: '101',
      rue: 'Rue de la République',
      complement: '',
      villeId: 2,
    });
  }

  create(addressData: Partial<Address>): Address {
    const address = new Address(addressData);
    address.id = this.idCounter++;
    this.addresses.set(address.id, address);
    return address;
  }

  findAll(): Address[] {
    return [...this.addresses.values()];
  }

  findOne(id: number): Address | undefined {
    return this.addresses.get(id);
  }

  update(id: number, addressData: Partial<Address>): Address | undefined {
    const address = this.addresses.get(id);
    if (!address) return undefined;

    Object.assign(address, addressData);
    this.addresses.set(id, address);
    return address;
  }

  delete(id: number): boolean {
    return this.addresses.delete(id);
  }
}
