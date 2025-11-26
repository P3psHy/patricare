import { IsString, IsOptional } from 'class-validator';

export class CreateAddressDto {
  @IsString() rue: string;

  @IsOptional()
  villeId?: number;
}
