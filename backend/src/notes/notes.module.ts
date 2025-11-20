import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { S3Module } from '../s3/s3.module';
import { FileSystemModule } from '../file-system/file-system.module';
import { NotesDirIdProvider } from './providers/notes-dir-id.provider';
import { SnapshotService } from './note-snapshot.service';
import { NoteDocumentManager } from './note-document.manager';
import { NoteSnapshotRepository } from './note-snapshot.repository';

@Module({
  imports: [S3Module, FileSystemModule],
  controllers: [NotesController],

  providers: [
    NotesService,
    SnapshotService,
    NoteDocumentManager,
    NoteSnapshotRepository,
    NotesDirIdProvider,
  ],
  exports: [NotesService, NoteDocumentManager],
})
export class NotesModule {}
