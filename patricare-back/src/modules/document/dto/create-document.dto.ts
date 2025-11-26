import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateDocumentDto {
  @IsString() titre: string;
  @IsString() cheminFichier: string;

  @IsOptional()
  @IsNumber()
  userId?: number;
}
