import { Module } from '@nestjs/common';
import { SyscallController } from './syscall.controller';
import { SyscallService } from './syscall.service';
import { DateHandler } from './handlers/builtins/date.handler';
import { HelpHandler } from './handlers/builtins/help.handler';
import { LsHandler } from './handlers/file-system/ls.handler';
import { FileSystemModule } from 'src/file-system/file-system.module';
import { UnameHandler } from './handlers/builtins/uname.handler';

@Module({
  imports: [FileSystemModule],
  controllers: [SyscallController],
  providers: [SyscallService, DateHandler, HelpHandler, LsHandler, UnameHandler],
})
export class SyscallModule {}
