import { IsBoolean, IsNumber } from 'class-validator';

export class CreateLodgingDto {
  @IsBoolean() estLoue: boolean;
  @IsNumber() prixLoyer: number;
  @IsNumber() superficie: number;
  @IsNumber() nbPiece: number;
}
