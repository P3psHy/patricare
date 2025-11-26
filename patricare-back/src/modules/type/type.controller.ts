import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { TypeService } from './type.service';
import { CreateTypeDto } from './dto/type.dto';

@Controller('types')
export class TypeController {
    constructor(private readonly typeService: TypeService) { }

    @Post()
    create(@Body() createTypeDto: CreateTypeDto) {
        return this.typeService.create(createTypeDto);
    }

    @Get()
    findAll() {
        return this.typeService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.typeService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTypeDto: CreateTypeDto) {
        return this.typeService.update(+id, updateTypeDto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        this.typeService.delete(+id);
        return { success: true };
    }
}
