import { Module } from '@nestjs/common';
import { WindowsService } from './windows.service';
import { WindowsController } from './windows.controller';
import { WindowsRepository } from './windows.repository';
import { FileSystemModule } from 'src/file-system/file-system.module';
import { ProcessesModule } from 'src/processes/processes.module';

@Module({
  imports: [FileSystemModule, ProcessesModule],
  controllers: [WindowsController],
  providers: [WindowsService, WindowsRepository],
  exports: [WindowsRepository],
})
export class WindowsModule {}
