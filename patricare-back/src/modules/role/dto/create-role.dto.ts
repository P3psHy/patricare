import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  role!: string;
}

