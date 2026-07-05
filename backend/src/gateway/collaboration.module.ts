import { forwardRef, Module } from '@nestjs/common';
import { CollaborationGateway } from './collaboration.gateway';
import { NotesModule } from 'src/notes/notes.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [forwardRef(() => NotesModule), RedisModule],
  providers: [CollaborationGateway],
  exports: [CollaborationGateway],
})
export class CollaborationModule {}
