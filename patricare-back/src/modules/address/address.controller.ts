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
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';

@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  create(@Body() dto: CreateAddressDto): Promise<Address> {
    return this.addressService.create(dto);
  }

  @Get()
  findAll(
    @Query('rue') rue?: string,
    @Query('villeId') villeId?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<Address[]> {
    const filter: any = {};
    if (rue) filter.rue = rue;

    if (villeId !== undefined) {
      const parsedVilleId = Number(villeId);
      if (Number.isNaN(parsedVilleId)) throw new BadRequestException('villeId must be a number');
      filter.villeId = parsedVilleId;
    }

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

    return this.addressService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Address> {
    return this.addressService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAddressDto): Promise<Address> {
    return this.addressService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.addressService.remove(id);
  }
}

