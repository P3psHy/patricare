import { PartialType, OmitType } from '@nestjs/mapped-types';
import { ValidateIf, IsInt, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['logementId'] as const)) {
  // Accept explicit null to unset habitation
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsInt()
  @IsOptional()
  logementId?: number | null;
}