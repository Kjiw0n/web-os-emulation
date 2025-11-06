import { Module } from '@nestjs/common';
import { FileSystemService } from './file-system.service';
import { FileSystemController } from './file-system.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileSystem } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([FileSystem])],
  controllers: [FileSystemController],
  providers: [FileSystemService],
  exports: [TypeOrmModule],
})
export class FileSystemModule {}
