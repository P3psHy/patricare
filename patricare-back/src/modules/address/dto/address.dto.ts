import { IsString, IsOptional } from 'class-validator';

export class CreateAdresseDto {
  @IsString() rue: string;

  @IsOptional()
  villeId?: number;
}

export class UpdateAdresseDto {
  @IsOptional()
  @IsString()
  rue?: string;

  @IsOptional()
  villeId?: number;
}
