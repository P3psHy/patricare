import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';

@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressService.create(createAddressDto);
  }

  @Get()
  findAll() {
    return this.addressService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddressDto: CreateAddressDto) {
    return this.addressService.update(Number(id), updateAddressDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return {
      success: this.addressService.delete(Number(id)),
    };
  }
}
