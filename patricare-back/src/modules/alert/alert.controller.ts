import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { AlertService } from './alert.service';
import { CreateAlertDto } from './dto/create-alert.dto';

@Controller('alerts')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Post()
  create(@Body() createAlertDto: CreateAlertDto) {
    return this.alertService.create(createAlertDto);
  }

  @Get()
  findAll() {
    return this.alertService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alertService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlertDto: CreateAlertDto) {
    return this.alertService.update(Number(id), updateAlertDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return {
      success: this.alertService.delete(Number(id)),
    };
  }
}
