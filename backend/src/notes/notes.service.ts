import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { CreateNotesDto } from './dto/notes.dto';
import { S3Service } from '../s3/s3.service';
import { FileSystemRepository } from '../file-system/file-system.repository';
import { FileSystem } from '../file-system/entities/file-system.entity';
import { FileType } from '../file-system/types/file-type.enum';
import { SnapshotService } from './note-snapshot.service';
import { CollaborationGateway } from 'src/gateway/collaboration.gateway';

export interface CreateNotesResponse {
  id: number;
  name: string;
  content: string;
}

@Injectable()
export class NotesService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly fileSystemRepository: FileSystemRepository,
    private readonly snapshotService: SnapshotService,
    @Inject('NOTES_DIR_ID') private readonly notesDirId: number,
    @Inject(forwardRef(() => CollaborationGateway))
    private readonly collaborationGateway: CollaborationGateway,
  ) {}

  /**
   * 새로운 노트 파일을 생성합니다.
   * @param {CreateNotesDto} createNotesDto - 생성할 노트의 정보 (제목, 내용)
   * @returns {Promise<CreateNotesResponse>} 생성된 파일의 ID, 제목, 내용
   * @description S3에 파일 내용을 저장하고, 파일 시스템에 메타데이터를 저장합니다. Lobby에 파일 생성 알림을 전송합니다.
   */
  async create(createNotesDto: CreateNotesDto): Promise<CreateNotesResponse> {
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
    fileSystem.parentId = this.notesDirId;
    fileSystem.permissions = 'rwx';

    const savedFileSystem = await this.fileSystemRepository.save(fileSystem);

    // 로비에 "새 파일 생성됨" 알림 전송
    this.collaborationGateway.broadcastToLobby('create', {
      id: savedFileSystem.id,
      name: savedFileSystem.name,
      updatedAt: savedFileSystem.updatedAt,
    });

    return {
      id: savedFileSystem.id,
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
    const NOTE_DIR_ID = this.notesDirId;

    const files =
      await this.fileSystemRepository.findChildrenByParentId(NOTE_DIR_ID);
    return files.map((file) => ({
      id: file.id,
      name: file.name,
      updatedAt: file.updatedAt,
    }));
  }

  async createSnapshot(fileId: number): Promise<void> {
    return this.snapshotService.createSnapshot(fileId);
  }

  async deleteNotes(id: number) {
    const file = await this.fileSystemRepository.findById(id);
    if (!file) {
      throw new Error(`파일 ID ${id}를 찾을 수 없습니다.`);
    }

    // 1) S3에서 파일 삭제
    if (file.contentUrl) {
      await this.s3Service.deleteFile(file.contentUrl);
    }

    // 2) DB에서 메타데이터 삭제
    await this.fileSystemRepository.deleteById(id);

    return { message: `${file.name} 삭제 완료`, id };
  }
}
