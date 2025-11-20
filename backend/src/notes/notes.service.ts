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

  /**
   * 새로운 노트 파일을 생성합니다.
   * @param {CreateNotesDto} createNotesDto - 생성할 노트의 정보 (제목, 내용)
   * @returns {Promise<void>}
   * @description S3에 파일 내용을 저장하고, 파일 시스템에 메타데이터를 저장합니다.
   */
  async create(createNotesDto: CreateNotesDto) {
    const fileName = createNotesDto.name;

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

    const savedFileSystem = await this.fileSystemRepository.save(fileSystem);

    return {
      fileId: savedFileSystem.id,
      name: savedFileSystem.name,
      content: content,
    };
  }

  /**
   * 파일 ID로 노트 파일의 내용을 조회합니다.
   * @param {string} id - 조회할 파일의 ID
   * @returns {Promise<string>} 파일의 내용
   * @throws {Error} 파일을 찾을 수 없거나, 파일이 아니거나, Object Storage에 파일이 없을 겨우
   * @description S3에서 파일 내용을 다운로드합니다.
   */
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
    const key = decodeURIComponent(url.pathname.slice(1));
    return await this.s3Service.downloadFile(key);
  }

  /**
   * 모든 노트 파일의 목록을 조회합니다.
   * @returns 노트 파일 목록
   * @description 파일 시스템 레포지토리에서 모든 파일을 조회합니다.
   */
  async findAllNotes() {
    const NOTE_DIR_ID = 5;

    const files = await this.fileSystemRepository.findChildrenByParentId(NOTE_DIR_ID);
    return files.map((file) => ({
      id: file.id,
      name: file.name,
      updatedAt: file.updatedAt
    }));
  }
}
