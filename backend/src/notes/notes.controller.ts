import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNotesDto } from './dto/notes.dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createNotesDto: CreateNotesDto) {
    return this.notesService.create(createNotesDto);
  }
}
