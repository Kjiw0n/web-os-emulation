import { Controller, Post, Body } from '@nestjs/common';
import { WindowsService } from './windows.service';
import { CreateWindowDto, CreateWindowResponseDto } from './dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('windows')
@Controller('windows')
export class WindowsController {
  constructor(private readonly windowsService: WindowsService) {}

  @Post('open')
  @ApiOperation({
    summary: '새 윈도우 생성',
    description: '지정된 위치와 크기로 새로운 윈도우를 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '윈도우가 성공적으로 생성됨',
    type: CreateWindowResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 데이터',
  })
  @ApiBody({ type: CreateWindowDto })
  openWindow(@Body() dto: CreateWindowDto): Promise<CreateWindowResponseDto> {
    return this.windowsService.create(dto);
  }
}
