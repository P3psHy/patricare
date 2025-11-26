import { Address } from './entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

export interface AddressFilter {
  rue?: string;
  villeId?: number;
  limit?: number;
  offset?: number;
}

export interface IAddressService {
  create(dto: CreateAddressDto): Promise<Address>;
  findAll(filter?: AddressFilter): Promise<Address[]>;
  findOne(id: number): Promise<Address>;
  update(id: number, dto: UpdateAddressDto): Promise<Address>;
  remove(id: number): Promise<void>;
  findByCityId(villeId: number): Promise<Address[]>;
}

