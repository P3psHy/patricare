import { IsString, IsOptional } from 'class-validator';

export class CreateDocumentDto {
  @IsString() nom: string;
  @IsString() type: string;

  @IsOptional()
  dateModification?: Date;
}

export class UpdateDocumentDto {
  @IsOptional() @IsString() nom?: string;
  @IsOptional() @IsString() type?: string;
  @IsOptional() dateModification?: Date;
}
