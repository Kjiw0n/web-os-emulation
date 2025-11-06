import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FileSystemService } from './file-system.service';
import { CreateFileSystemDto } from './dto/create-file-system.dto';
import { UpdateFileSystemDto } from './dto/update-file-system.dto';

@Controller('file-system')
export class FileSystemController {
  constructor(private readonly fileSystemService: FileSystemService) {}

  @Post()
  create(@Body() createFileSystemDto: CreateFileSystemDto) {
    return this.fileSystemService.create(createFileSystemDto);
  }

  @Get()
  findAll() {
    return this.fileSystemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileSystemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileSystemDto: UpdateFileSystemDto) {
    return this.fileSystemService.update(+id, updateFileSystemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fileSystemService.remove(+id);
  }
}
