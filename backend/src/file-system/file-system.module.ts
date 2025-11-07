import { Module } from '@nestjs/common';
import { FileSystemService } from './file-system.service';
import { FileSystemController } from './file-system.controller';
import { FileSystemRepository } from './file-system.repository';

@Module({
  imports: [],
  controllers: [FileSystemController],
  providers: [FileSystemService, FileSystemRepository],
  exports: [FileSystemRepository],
})
export class FileSystemModule {}
