import { IsString, IsOptional } from 'class-validator';

export class UpdateAlerteDto {
  @IsOptional() @IsString() titre?: string;
  @IsOptional() @IsString() commentaire?: string;

  @IsOptional() userId?: number;
  @IsOptional() logementId?: number;
  @IsOptional() typeId?: number;
}
