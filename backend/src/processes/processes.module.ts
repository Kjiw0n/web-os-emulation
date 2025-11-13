import { Module } from '@nestjs/common';
import { ProcessesService } from './processes.service';
import { ProcessesController } from './processes.controller';
import { ProcessesRepository } from './processes.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Process } from './entities/process.entity';

@Module({
  controllers: [ProcessesController],
  providers: [ProcessesService, ProcessesRepository],
  imports: [TypeOrmModule.forFeature([Process])],
  exports: [ProcessesRepository, TypeOrmModule.forFeature([Process])],
})
export class ProcessesModule {}
