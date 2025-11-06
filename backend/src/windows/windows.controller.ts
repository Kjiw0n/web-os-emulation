import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WindowsService } from './windows.service';
import {
  CreateWindowDto,
  CreateWindowResponseDto,
  UpdateWindowDto,
} from './dto';

@Controller('windows')
export class WindowsController {
  constructor(private readonly windowsService: WindowsService) {}

  @Post('open')
  openWindow(@Body() dto: CreateWindowDto): Promise<CreateWindowResponseDto> {
    return this.windowsService.create(dto);
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
