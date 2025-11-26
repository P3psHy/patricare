import { IsString, IsOptional } from 'class-validator';

export class UpdateAdresseDto {
  @IsOptional()
  @IsString()
  rue?: string;

  @IsOptional()
  villeId?: number;
}
