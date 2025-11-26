import { IsString } from 'class-validator';

export class CreateRoleDto {
  id: number;
  @IsString() role: string;
}
