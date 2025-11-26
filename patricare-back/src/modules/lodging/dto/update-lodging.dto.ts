import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UpdateLodgingDto {
  @IsOptional() @IsBoolean() estLoue?: boolean;
  @IsOptional() @IsNumber() prixLoyer?: number;
  @IsOptional() @IsNumber() superficie?: number;
  @IsOptional() @IsNumber() nbPiece?: number;
}
