import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './entities/city.entity';

@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  create(@Body() dto: CreateCityDto): Promise<City> {
    return this.cityService.create(dto);
  }

  @Get()
  findAll(
    @Query('nom') nom?: string,
    @Query('codePostal') codePostal?: string,
    @Query('departement') departement?: string,
    @Query('region') region?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<City[]> {
    const filter: any = {};
    if (nom) filter.nom = nom;
    if (codePostal) filter.codePostal = codePostal;
    if (departement) filter.departement = departement;
    if (region) filter.region = region;

    if (limit !== undefined) {
      const parsedLimit = Number(limit);
      if (Number.isNaN(parsedLimit)) throw new BadRequestException('limit must be a number');
      filter.limit = parsedLimit;
    }

    if (offset !== undefined) {
      const parsedOffset = Number(offset);
      if (Number.isNaN(parsedOffset)) throw new BadRequestException('offset must be a number');
      filter.offset = parsedOffset;
    }

    return this.cityService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<City> {
    return this.cityService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCityDto): Promise<City> {
    return this.cityService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.cityService.remove(id);
  }
}

