import { IsString } from 'class-validator';

export class UpdateCityDto {
  @IsString() nom?: string;
  @IsString() codePostal?: string;
  @IsString() departement?: string;
  @IsString() region?: string;
}
