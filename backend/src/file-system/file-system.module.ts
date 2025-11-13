import { Module } from '@nestjs/common';
import { FileSystemService } from './file-system.service';
import { FileSystemController } from './file-system.controller';
import { FileSystemRepository } from './file-system.repository';
import { S3Module } from 'src/s3/s3.module';
import { ProcessesRepository } from 'src/processes/processes.repository';

@Module({
  imports: [S3Module],
  controllers: [FileSystemController],
  providers: [FileSystemService, FileSystemRepository, ProcessesRepository],
  exports: [FileSystemService, FileSystemRepository],
})
export class FileSystemModule {}
