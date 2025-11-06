import { Module } from '@nestjs/common';
import { SyscallController } from './syscall.controller';
import { SyscallService } from './syscall.service';
import { DateHandler } from './handlers/builtins/date.handler';

@Module({
  controllers: [SyscallController],
  providers: [SyscallService, DateHandler],
})
export class SyscallModule {}
