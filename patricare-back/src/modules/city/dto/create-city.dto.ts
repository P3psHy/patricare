import { IsString } from 'class-validator';

export class CreateCityDto {
  @IsString() nom: string;
  @IsString() codePostal: string;
  @IsString() departement: string;
  @IsString() region: string;
}
