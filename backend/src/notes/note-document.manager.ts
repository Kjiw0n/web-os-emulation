import { Injectable, OnModuleInit } from '@nestjs/common';
import { FileSystemRepository } from 'src/file-system/file-system.repository';
import { S3Service } from 'src/s3/s3.service';
import * as Y from 'yjs';

@Injectable()
export class NoteDocumentManager implements OnModuleInit {
  private documents = new Map<number, Y.Doc>();

  constructor(
    private readonly fileSystemRepo: FileSystemRepository,
    private readonly s3Service: S3Service,
  ) {}

  async onModuleInit() {
    await this.loadAllSnapshots();
  }

  // 서버 시작 시 모든 note 스냅샷 로드
  private async loadAllSnapshots(): Promise<void> {
    // note dir 찾기
    const notesDir = await this.fileSystemRepo.findByDirName('notes');
    if (!notesDir?.isDirectory())
      throw new Error('notes는 디렉토리가 아니거나 없습니다.');

    // notes 내부 모든 자식 노드 조회
    const children = await this.fileSystemRepo.findChildrenByParentId(
      notesDir.id,
    );

    // 각 파일의 contentUrl에서 스냅샷 로드
    for (const file of children) {
      const key = file.getStorageKey();
      if (!key) continue;

      try {
        const snapshotData = await this.s3Service.downloadBinary(key);

        // string → Uint8Array 변환 및 Y.Doc 적용
        const ydoc = new Y.Doc();
        Y.applyUpdate(ydoc, snapshotData);

        this.documents.set(file.id, ydoc);
      } catch (error) {
        console.error(`Failed to load snapshot for file ${file.id}:`, error);
      }
    }
  }

  // Y.Doc 조회 또는 생성
  getOrCreate(fileId: number): Y.Doc {
    let doc = this.documents.get(fileId);

    if (!doc) {
      doc = new Y.Doc();
      this.documents.set(fileId, doc);
    }

    return doc;
  }

  // Y.Doc 삭제 (메모리 해제)
  delete(fileId: number): void {
    const doc = this.documents.get(fileId);
    if (doc) {
      doc.destroy();
      this.documents.delete(fileId);
    }
  }

  // Update 적용
  applyUpdate(fileId: number, update: Uint8Array): void {
    const doc = this.getOrCreate(fileId);
    Y.applyUpdate(doc, update);
  }
}
