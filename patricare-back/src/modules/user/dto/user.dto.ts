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

export class UpdateUserDto {
  @IsOptional() @IsString() firstname?: string;
  @IsOptional() @IsString() lastname?: string;
  @IsOptional() @IsString() telephone?: string;
  @IsOptional() @IsEmail() mail?: string;
  @IsOptional() @IsString() password?: string;

  @IsOptional()
  roleId?: number;
}
