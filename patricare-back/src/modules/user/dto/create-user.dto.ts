import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString() firstname: string;
  @IsString() lastname: string;
  @IsString() telephone: string;

  @IsEmail() mail: string;

  @IsString() password: string;

  @IsOptional()
  roleId?: number;
}
