import { Body, Controller, Post } from '@nestjs/common';
import { SyscallService } from './syscall.service';
import { SyscallDto } from './dto/syscall.dto';

@Controller('syscall')
export class SyscallController {
  constructor(private readonly syscallService: SyscallService) {}

  @Post()
  executeSyscall(@Body() syscallDto: SyscallDto) {
    return this.syscallService.handleCommand(syscallDto);
  }
}
