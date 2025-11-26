import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { LodgingService } from './lodging.service';
import { CreateLodgingDto } from './dto/create-lodging.dto';

@Controller('lodgings')
export class LodgingController {
  constructor(private readonly lodgingService: LodgingService) { }

  @Post()
  create(@Body() createLodgingDto: CreateLodgingDto) {
    return this.lodgingService.create(createLodgingDto);
  }

  @Get()
  findAll() {
    return this.lodgingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lodgingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLodgingDto: CreateLodgingDto) {
    return this.lodgingService.update(+id, updateLodgingDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    this.lodgingService.delete(+id);
    return { success: true };
  }
}
