import { IsNumber } from 'class-validator';

export class CreateDocLodging2CityDto {
  @IsNumber() documentId: number;
  @IsNumber() logementId: number;
  @IsNumber() villeId: number;
}
