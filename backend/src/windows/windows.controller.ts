import { Controller, Post, Body } from '@nestjs/common';
import { WindowsService } from './windows.service';
import { CreateWindowDto, CreateWindowResponseDto } from './dto';

@Controller('windows')
export class WindowsController {
  constructor(private readonly windowsService: WindowsService) {}

  @Post('open')
  openWindow(@Body() dto: CreateWindowDto): Promise<CreateWindowResponseDto> {
    return this.windowsService.create(dto);
  }
}
