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
    fileSystem.parentId = null;
    fileSystem.permissions = 'rwx';

    await this.fileSystemRepository.save(fileSystem);
  }

  async getFile(id: string): Promise<string> {
    const fileSystem = await this.fileSystemRepository.findById(parseInt(id));

    if (!fileSystem) {
      throw new Error(`파일 ID ${id}를 찾을 수 없습니다.`);
    }

    if (fileSystem.type !== FileType.FILE) {
      throw new Error(`'${fileSystem.name}'는 파일이 아닙니다.`);
    }

    if (!fileSystem.contentUrl) {
      throw new Error(`'${fileSystem.name}'이 손상되었습니다.`);
    }

    const url = new URL(fileSystem.contentUrl);
    const key = url.pathname.slice(1); // 앞의 '/' 제거

    return await this.s3Service.downloadFile(key);
  }
}
