import { IsString, IsNumber } from 'class-validator';

export class CreateUser2LodgingDto {
  @IsNumber() userId: number;
  @IsNumber() logementId: number;
  @IsString() statut: string;
}

export class UpdateUser2LodgingDto {
  @IsString() statut?: string;
}
