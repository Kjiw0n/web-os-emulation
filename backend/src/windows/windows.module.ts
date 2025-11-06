import { Module } from '@nestjs/common';
import { WindowsService } from './windows.service';
import { WindowsController } from './windows.controller';
import { WindowsRepository } from './windows.repository';

@Module({
  imports: [],
  controllers: [WindowsController],
  providers: [WindowsService, WindowsRepository],
  exports: [WindowsRepository],
})
export class WindowsModule {}
