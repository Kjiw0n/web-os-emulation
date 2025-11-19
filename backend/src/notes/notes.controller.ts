import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNotesDto } from './dto/notes.dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createNotesDto: CreateNotesDto): Promise<void> {
    return this.notesService.create(createNotesDto);
  }

  @Get('files/')
  async getFile(@Query('id') id: string): Promise<string> {
    return this.notesService.getFile(id);
  }
}
