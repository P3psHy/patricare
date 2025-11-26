import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { LodgingService } from './lodging.service';
import { CreateLodgingDto } from './dto/create-lodging.dto';
import { UpdateLodgingDto } from './dto/update-lodging.dto';
import { Lodging } from './entities/lodging.entity';

class SetRentStatusDto {
  estLoue!: boolean;
}

@Controller('lodgings')
export class LodgingController {
  constructor(private readonly lodgingService: LodgingService) {}

  @Post()
  create(@Body() dto: CreateLodgingDto): Promise<Lodging> {
    return this.lodgingService.create(dto);
  }

  @Get()
  async findAll(
    @Query('estLoue') estLoue?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('minSurface') minSurface?: string,
    @Query('maxSurface') maxSurface?: string,
    @Query('minNbPiece') minNbPiece?: string,
    @Query('maxNbPiece') maxNbPiece?: string,
    @Query('adresseId') adresseId?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    // parse and validate query params
    const filter: any = {};
    if (estLoue !== undefined) {
      if (estLoue === 'true' || estLoue === 'false') filter.estLoue = estLoue === 'true';
      else throw new BadRequestException('estLoue must be true or false');
    }
    if (minPrice) filter.minPrice = Number(minPrice);
    if (maxPrice) filter.maxPrice = Number(maxPrice);
    if (minSurface) filter.minSurface = Number(minSurface);
    if (maxSurface) filter.maxSurface = Number(maxSurface);
    if (minNbPiece) filter.minNbPiece = Number(minNbPiece);
    if (maxNbPiece) filter.maxNbPiece = Number(maxNbPiece);
    if (adresseId) filter.adresseId = Number(adresseId);
    if (limit) filter.limit = Number(limit);
    if (offset) filter.offset = Number(offset);

    return this.lodgingService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Lodging> {
    const lodging = await this.lodgingService.findOne(id); // service retourne Promise<Lodging | null>
    if (!lodging) throw new NotFoundException(`Lodging with id ${id} not found`);
    return lodging;
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLodgingDto): Promise<Lodging> {
    return this.lodgingService.update(id, dto);
  }

  @Patch(':id/rent')
  setRentStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: SetRentStatusDto): Promise<Lodging> {
    return this.lodgingService.setRentStatus(id, dto.estLoue);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.lodgingService.remove(id);
  }
}