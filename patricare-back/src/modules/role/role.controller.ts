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
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  create(@Body() dto: CreateRoleDto): Promise<Role> {
    return this.roleService.create(dto);
  }

  @Get()
  findAll(@Query('role') role?: string, @Query('limit') limit?: string, @Query('offset') offset?: string) {
    const filter: any = {};
    if (role) filter.role = role;
    if (limit) filter.limit = Number(limit);
    if (offset) filter.offset = Number(offset);
    return this.roleService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoleDto): Promise<Role> {
    return this.roleService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.roleService.remove(id);
  }
}