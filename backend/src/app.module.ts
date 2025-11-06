import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WindowsModule } from './windows/windows.module';

@Module({
  imports: [WindowsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
