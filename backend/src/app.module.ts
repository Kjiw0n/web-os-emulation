import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WindowsModule } from './windows/windows.module';
import { FileSystemModule } from './file-system/file-system.module';

@Module({
  imports: [WindowsModule, FileSystemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
