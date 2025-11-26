import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateDocumentDto {
  @IsOptional() @IsString() titre?: string;
  @IsOptional() @IsString() cheminFichier?: string;
  @IsOptional() @IsNumber() userId?: number;
}
