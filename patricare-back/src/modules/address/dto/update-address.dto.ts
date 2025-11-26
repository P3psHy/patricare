import { IsString, IsOptional } from 'class-validator';

export class UpdateAddressDto {
  @IsOptional()
  @IsString()
  rue?: string;

  @IsOptional()
  villeId?: number;
}
