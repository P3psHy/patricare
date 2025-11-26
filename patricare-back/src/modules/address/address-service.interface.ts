import { Adresse } from './entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

export interface AddressFilter {
  rue?: string;
  villeId?: number;
  limit?: number;
  offset?: number;
}

export interface IAddressService {
  create(dto: CreateAddressDto): Promise<Adresse>;
  findAll(filter?: AddressFilter): Promise<Adresse[]>;
  findOne(id: number): Promise<Adresse>;
  update(id: number, dto: UpdateAddressDto): Promise<Adresse>;
  remove(id: number): Promise<void>;
  findByCityId(villeId: number): Promise<Adresse[]>;
}

