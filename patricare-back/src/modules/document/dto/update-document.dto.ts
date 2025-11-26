import { IsString, IsOptional } from 'class-validator';

export class UpdateDocumentDto {
  @IsOptional() @IsString() nom?: string;
  @IsOptional() @IsString() type?: string;
  @IsOptional() dateModification?: Date;
}
