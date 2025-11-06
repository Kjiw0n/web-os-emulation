import { Module } from '@nestjs/common';
import { WindowsService } from './windows.service';
import { WindowsController } from './windows.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Window } from './entities/window.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Window])],
  controllers: [WindowsController],
  providers: [WindowsService],
  exports: [TypeOrmModule],
})
export class WindowsModule {}
