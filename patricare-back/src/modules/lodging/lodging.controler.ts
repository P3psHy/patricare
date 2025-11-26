import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';

import { LodgingServiceInterface } from './lodging-service.interface';
import { CreateLodgingDto } from './dto/create-lodging.dto';
import { UpdateLodgingDto } from './dto/update-lodging.dto';
import { LodgingDto } from './dto/lodging.dto'; // <- ajouté

@Controller('logements')
export class LodgingController {
  constructor(private readonly lodgingService: LodgingServiceInterface) {}

  // GET /logements
  @Get()
  async getAll(): Promise<LodgingDto[]> {
    return this.lodgingService.findAll();
  }

  // GET /logements/:id
  @Get(':id')
  async getOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LodgingDto> {
    return this.lodgingService.findById(id);
  }

  // POST /logements
  @Post()
  async create(
    @Body() dto: CreateLodgingDto,
  ): Promise<LodgingDto> {
    return this.lodgingService.create(dto);
  }

  // PUT /logements/:id
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLodgingDto,
  ): Promise<LodgingDto> {
    return this.lodgingService.update(id, dto);
  }

  // DELETE /logements/:id
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.lodgingService.delete(id);
  }
}
