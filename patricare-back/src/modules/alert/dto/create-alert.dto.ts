import { IsString, IsOptional } from 'class-validator';

export class CreateAlertDto {
  @IsString() titre: string;
  @IsString() commentaire: string;

  @IsOptional()
  userId?: number;

  @IsOptional()
  logementId?: number;

  @IsOptional()
  typeId?: number;
}
