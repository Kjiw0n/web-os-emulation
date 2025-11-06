import { Module } from '@nestjs/common';
import { SyscallController } from './syscall.controller';
import { SyscallService } from './syscall.service';

@Module({
  controllers: [SyscallController],
  providers: [SyscallService],
})
export class SyscallModule {}
