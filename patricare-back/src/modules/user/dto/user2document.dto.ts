import { IsString, IsNumber } from 'class-validator';

export class CreateUser2DocumentDto {
  @IsNumber() userId: number;
  @IsNumber() documentId: number;
}
