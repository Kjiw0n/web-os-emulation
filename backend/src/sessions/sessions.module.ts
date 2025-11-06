import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { SessionsRepository } from './sessions.repository';

@Module({
  imports: [],
  controllers: [SessionsController],
  providers: [SessionsService, SessionsRepository],
  exports: [SessionsRepository],
})
export class SessionsModule {}
