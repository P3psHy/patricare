import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get()
  findAll(@Query('roleId') roleId?: string) {
    const filter: any = {};
    if (roleId) filter.roleId = Number(roleId);
    return this.userService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  @Patch(':id/logement/:logementId')
  setHabitation(@Param('id', ParseIntPipe) id: number, @Param('logementId', ParseIntPipe) logementId: number) {
    return this.userService.setHabitation(id, logementId);
  }

  @Patch(':id/unset-logement')
  unsetHabitation(@Param('id', ParseIntPipe) id: number) {
    return this.userService.unsetHabitation(id);
  }
}