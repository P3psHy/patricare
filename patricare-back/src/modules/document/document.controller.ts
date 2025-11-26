import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/document.dto';

@Controller('documents')
export class DocumentController {
    constructor(private readonly documentService: DocumentService) { }

    @Post()
    create(@Body() createDocumentDto: CreateDocumentDto) {
        return this.documentService.create(createDocumentDto);
    }

    @Get()
    findAll() {
        return this.documentService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.documentService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDocumentDto: CreateDocumentDto) {
        return this.documentService.update(+id, updateDocumentDto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        this.documentService.delete(+id);
        return { success: true };
    }
}
