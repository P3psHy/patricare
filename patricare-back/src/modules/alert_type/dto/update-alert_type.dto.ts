import { IsString } from 'class-validator';

export class UpdateAlertTypeDto {
  @IsString() nom?: string;
}
