import { City } from './entities/city.entity';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

export interface CityFilter {
  nom?: string;
  codePostal?: string;
  departement?: string;
  region?: string;
  limit?: number;
  offset?: number;
}

export interface ICityService {
  create(dto: CreateCityDto): Promise<City>;
  findAll(filter?: CityFilter): Promise<City[]>;
  findOne(id: number): Promise<City>;
  update(id: number, dto: UpdateCityDto): Promise<City>;
  remove(id: number): Promise<void>;
}

