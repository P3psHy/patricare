import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { LodgingServiceInterface } from './lodging-service.interface';// adapte le chemin
import { LodgingDto } from './dto/lodging.dto'; // adapte le chemin

@Controller('logements')
export class LodgingController {
  constructor(private readonly _lodgingService: LodgingServiceInterface) {}

  @Get()
  getAllLodging(): LodgingDto[] {
    return this._lodgingService.findAll();
  }

  @Get(':id')
  getLodging(@Param('id') id: number): LodgingDto {
    return this._lodgingService.findById(id);
  }

  @Post()
  createLodging(@Body() lodging: LodgingDto): LodgingDto {
    return this._lodgingService.create(lodging);
  }

  @Put(':id')
  updateLodging(
    @Param('id') id: number,
    @Body() lodging: LodgingDto,
  ): LodgingDto {
    return this._lodgingService.update(id, lodging);
  }

  @Delete(':id')
  deleteLodging(@Param('id') id: number): void {
    return this._lodgingService.delete(id);
  }
}
