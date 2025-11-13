import { Body, Controller, Post } from '@nestjs/common';
import { SyscallService } from './syscall.service';
import { SyscallDto } from './dto/syscall.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SyscallResponseDto } from './dto';

@ApiTags('syscall')
@Controller('syscall')
export class SyscallController {
  constructor(private readonly syscallService: SyscallService) {}

  @Post()
  @ApiOperation({
    summary: '시스템 콜 실행',
    description: '프로세스에 대한 시스템 명령을 실행합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '시스템 콜이 성공적으로 실행됨',
    type: SyscallResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 데이터',
  })
  @Post()
  executeSyscall(@Body() syscallDto: SyscallDto) {
    return this.syscallService.handleCommand(syscallDto);
  }
}
