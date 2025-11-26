import { IsOptional, IsString } from 'class-validator';

export class UpdateCityDto {
    @IsOptional() @IsString() nom?: string;
    @IsOptional() @IsString() codePostal?: string;
    @IsOptional() @IsString() departement?: string;
    @IsOptional() @IsString() region?: string;
}
