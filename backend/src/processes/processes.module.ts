import { Module } from '@nestjs/common';
import { ProcessesService } from './processes.service';
import { ProcessesController } from './processes.controller';
import { ProcessesRepository } from './processes.repository';

@Module({
  controllers: [ProcessesController],
  providers: [ProcessesService, ProcessesRepository],
  exports: [ProcessesRepository],
})
export class ProcessesModule {}
