import { IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString() role: string;
}

export class UpdateRoleDto {
  @IsString() role?: string;
}
