import { Module } from '@nestjs/common';
import { WindowsService } from './windows.service';
import { WindowsController } from './windows.controller';

@Module({
  controllers: [WindowsController],
  providers: [WindowsService],
})
export class WindowsModule {}
