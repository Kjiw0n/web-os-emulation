import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { S3Module } from '../s3/s3.module';
import { FileSystemModule } from '../file-system/file-system.module';
import { NotesDirIdProvider } from './providers/notes-dir-id.provider';

@Module({
  imports: [S3Module, FileSystemModule],
  controllers: [NotesController],
  providers: [NotesService, NotesDirIdProvider],
  exports: [NotesService],
})
export class NotesModule {}
