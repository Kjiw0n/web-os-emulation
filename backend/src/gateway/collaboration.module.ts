import { Module } from '@nestjs/common';
import { CollaborationGateway } from './collaboration.gateway';
import { NotesModule } from 'src/notes/notes.module';

@Module({
  imports: [NotesModule],
  providers: [CollaborationGateway],
})
export class CollaborationModule {}
