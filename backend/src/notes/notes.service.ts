import { Injectable } from '@nestjs/common';
import { CreateNotesDto } from './dto/notes.dto';
import { S3Service } from '../s3/s3.service';
import { FileSystemRepository } from '../file-system/file-system.repository';
import { FileSystem } from '../file-system/entities/file-system.entity';
import { FileType } from '../file-system/types/file-type.enum';

@Injectable()
export class NotesService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly fileSystemRepository: FileSystemRepository,
  ) {}

  async create(createNotesDto: CreateNotesDto): Promise<void> {
    const fileName = createNotesDto.title;

    const content = createNotesDto.content || '';

    // object storage에 현재 파일 내용을 기록
    const contentUrl = await this.s3Service.uploadFile(content, fileName);

    // 파일 시스템 레포지토리에 txt 확장자로 현재 파일의 메타데이터를 저장
    const fileSystem = new FileSystem();
    fileSystem.name = fileName;
    fileSystem.type = FileType.FILE;
    fileSystem.fileExtension = 'txt';
    fileSystem.contentUrl = contentUrl;
    fileSystem.size = '0';
    fileSystem.parentId = 5;
    fileSystem.permissions = 'rwx';

    await this.fileSystemRepository.save(fileSystem);
  }

  async getFile(id: string): Promise<void> {
    // TODO: fileSystemService에서 파일 id로 가져오는 로직 만들기
    // cat과 비슷하며, 조회된 텍스트를 JSON 바디에 담아 반환
  }
}
