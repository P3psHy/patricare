import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional() @IsString() firstname?: string;
  @IsOptional() @IsString() lastname?: string;
  @IsOptional() @IsString() telephone?: string;
  @IsOptional() @IsEmail() mail?: string;
  @IsOptional() @IsString() password?: string;

  @IsOptional()
  roleId?: number;
}
