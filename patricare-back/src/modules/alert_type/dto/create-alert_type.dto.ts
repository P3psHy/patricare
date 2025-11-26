import { IsString } from 'class-validator';

export class CreateAlertTypeDto {
  @IsString() nom: string;
}
