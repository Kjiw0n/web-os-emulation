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
import { FileSystemService } from 'src/file-system/file-system.service';

@Controller('notes')
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
    private readonly fileSystemService: FileSystemService,
  ) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createNotesDto: CreateNotesDto): Promise<void> {
    return this.notesService.create(createNotesDto);
  }

  @Get('files/')
  async getFile(@Query('id') id: string): Promise<void> {
    // TODO: fileSystemService에서 파일 id로 가져오는 로직 만들기
    // cat과 비슷하며, 조회된 텍스트를 JSON 바디에 담아 반환
  }
}
