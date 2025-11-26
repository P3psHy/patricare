import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAddressDto {
  @IsString()
  rue!: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  villeId?: number;
}

