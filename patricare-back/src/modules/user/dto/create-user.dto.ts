import { IsString, IsEmail, IsOptional, IsInt } from 'class-validator';

export class CreateUserDto {
  @IsString() firstname: string;
  @IsString() lastname: string;
  @IsString() telephone: string;

  @IsEmail() mail: string;

  @IsString() password: string;

  @IsInt()
  roleId!: number;

  @IsOptional()
  @IsInt()
  logementId?: number;
}