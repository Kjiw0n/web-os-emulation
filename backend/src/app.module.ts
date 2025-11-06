import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SyscallModule } from './syscall/syscall.module';

@Module({
  imports: [SyscallModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
