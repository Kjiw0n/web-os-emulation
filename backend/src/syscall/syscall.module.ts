import { Module } from '@nestjs/common';
import { SyscallController } from './syscall.controller';
import { SyscallService } from './syscall.service';
import { DateHandler } from './handlers/builtins/date.handler';
import { HelpHandler } from './handlers/builtins/help.handler';
import { UnameHandler } from './handlers/builtins/uname.handler';

@Module({
  controllers: [SyscallController],
  providers: [SyscallService, DateHandler, HelpHandler, UnameHandler],
})
export class SyscallModule {}
