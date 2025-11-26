import { Lodging } from './entities/lodging.entity';
import { CreateLodgingDto } from './dto/create-lodging.dto';
import { UpdateLodgingDto } from './dto/update-lodging.dto';

export interface LodgingFilter {
  estLoue?: boolean;
  minPrice?: number;
  maxPrice?: number;
  minSurface?: number;
  maxSurface?: number;
  minNbPiece?: number;
  maxNbPiece?: number;
  adresseId?: number;
  limit?: number;
  offset?: number;
}

export interface ILodgingService {
  create(dto: CreateLodgingDto): Promise<Lodging>;
  findAll(filter?: LodgingFilter): Promise<Lodging[]>;
  findOne(id: number): Promise<Lodging | null>;
  update(id: number, dto: UpdateLodgingDto): Promise<Lodging>;
  remove(id: number): Promise<void>;
  setRentStatus(id: number, estLoue: boolean): Promise<Lodging>;
  findByAddressId(adresseId: number): Promise<Lodging[]>;
}