import { Injectable } from '@nestjs/common';
import { NoteSnapshotRepository } from './note-snapshot.repository';
import { NoteDocumentManager } from './note-document.manager';
import { S3Service } from 'src/s3/s3.service';
import { FileSystemRepository } from 'src/file-system/file-system.repository';
import { NoteSnapshot } from './entities';

@Injectable()
export class SnapshotService {
  constructor(
    private readonly snapshotRepo: NoteSnapshotRepository,
    private readonly noteDocumentManager: NoteDocumentManager,
    private readonly s3Service: S3Service,
    private readonly fileSystemRepo: FileSystemRepository,
  ) {}

  // 스냅샷 생성 및 저장
  async createSnapshot(fileId: number): Promise<void> {
    const file = await this.fileSystemRepo.findById(fileId);
    if (!file) throw new Error(`일치하는 파일이 없습니다. FileID: ${fileId}`);

    // Y.Doc을 binary로 인코딩
    const snapshotData = this.noteDocumentManager.encodeDocument(fileId);
    if (!snapshotData) {
      throw new Error(`Document가 없습니다. FileID: ${fileId}`);
    }

    // 다음 버전 번호 계산
    const nextVersion = await this.getNextVersion(fileId);

    // Object Storage에 업로드
    const contentUrl = await this.s3Service.uploadBinary(
      snapshotData,
      file.name,
    );

    // URL에서 storageKey 추출
    const storageKey = this.s3Service.extractKeyFromUrl(contentUrl);

    // NoteSnapshot 레코드 생성
    const snapshot = NoteSnapshot.create(fileId, storageKey, nextVersion);
    await this.snapshotRepo.save(snapshot);

    // FileSystem.contentUrl 업데이트
    if (file) {
      file.contentUrl = contentUrl;
      await this.fileSystemRepo.save(file);
    }

    // 카운터 초기화
    this.noteDocumentManager.resetUpdateCount(fileId);
  }

  // 다음 버전 번호 계산
  private async getNextVersion(fileId: number): Promise<number> {
    const latestSnapshot = await this.snapshotRepo.findLatestByFileId(fileId);
    return latestSnapshot ? latestSnapshot.version + 1 : 1;
  }
}
