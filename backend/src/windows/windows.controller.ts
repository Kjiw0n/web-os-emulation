import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WindowsService } from './windows.service';
import { CreateWindowDto } from './dto/create-window.dto';
import { UpdateWindowDto } from './dto/update-window.dto';

@Controller('windows')
export class WindowsController {
  constructor(private readonly windowsService: WindowsService) {}

  @Post()
  create(@Body() createWindowDto: CreateWindowDto) {
    return this.windowsService.create(createWindowDto);
  }

  @Get()
  findAll() {
    return this.windowsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.windowsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWindowDto: UpdateWindowDto) {
    return this.windowsService.update(+id, updateWindowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.windowsService.remove(+id);
  }
}
