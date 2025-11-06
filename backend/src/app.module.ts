import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WindowsModule } from './windows/windows.module';
import { FileSystemModule } from './file-system/file-system.module';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [WindowsModule, FileSystemModule, SessionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
