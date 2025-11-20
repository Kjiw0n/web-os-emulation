import { Injectable, OnModuleInit } from '@nestjs/common';
import { FileSystem } from 'src/file-system/entities';
import { FileSystemRepository } from 'src/file-system/file-system.repository';
import { S3Service } from 'src/s3/s3.service';
import * as Y from 'yjs';

@Injectable()
export class NoteDocumentManager implements OnModuleInit {
  private documents = new Map<number, Y.Doc>();
  private updateCounts = new Map<number, number>();
  private readonly SNAPSHOT_THRESHOLD = 100;

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

    console.log(`[Snapshot Load] 총 ${children.length}개의 노트 발견`);

    // 각 파일의 contentUrl에서 스냅샷 로드
    for (const file of children) {
      const key = this.getOjbStorageKey(file);
      // 1. 키가 제대로 뽑혔는지 확인
      if (!key) {
        console.warn(
          // 키가 없는 건 데이터 정합성 문제일 수 있으므로 Warn
          `[Skip] fileId: ${file.id} - contentUrl이 없거나 키 추출 실패`,
        );
        continue;
      }

      try {
        // 2. 다운로드 시도 로그
        console.log(`[Downloading] fileId: ${file.id}, Key: ${key}`);

        const snapshotData = await this.s3Service.downloadBinary(key);

        // 3. 데이터 타입 및 크기 확인
        console.log(
          `[Downloaded] fileId: ${file.id}, Size: ${snapshotData.byteLength} bytes, Type: ${snapshotData.constructor.name}`,
        );

        // 빈 파일(0 bytes)은 Yjs update 형식이 아니므로 apply하면 에러 발생
        // -> 데이터가 있을 때만 적용하고, 없으면 그냥 빈 문서(new Y.Doc) 생성
        if (snapshotData.byteLength > 0) {
          const ydoc = new Y.Doc();
          Y.applyUpdate(ydoc, snapshotData);
          this.documents.set(file.id, ydoc);

          console.log(
            `[Yjs] 로드 성공: fileId ${file.id} (${snapshotData.byteLength} bytes)`,
          );
        } else {
          this.documents.set(file.id, new Y.Doc());
          console.log(
            `[Yjs] 빈 파일(0 bytes) - 빈 문서로 초기화: fileId ${file.id}`,
          );
        }
      } catch (error) {
        // 4. 에러의 상세 내용(Stack Trace, Code) 출력
        console.error(`[Error] Failed to load snapshot for file ${file.id}`);
        console.error(`  - Key: ${key}`);

        // AWS SDK 에러라면 code가 있습니다 (ex: NoSuchKey, AccessDenied)
        if (error && typeof error === 'object' && 'code' in error) {
          console.error(`  - AWS Error Code: ${error.code}`);
        }
        console.error(`  - Full Error:`, error);
      }
    }
  }

  private getOjbStorageKey(file: FileSystem): string | null {
    const url = file.contentUrl;
    if (!url) return null;

    return this.s3Service.extractKeyFromUrl(url);
  }

  // Y.Doc 조회 또는 생성
  getOrCreate(fileId: number): Y.Doc {
    let doc = this.documents.get(fileId);

    if (!doc) {
      doc = new Y.Doc();
      this.documents.set(fileId, doc);
      this.updateCounts.set(fileId, 0);
    }

    return doc;
  }

  // Y.Doc 삭제 (메모리 해제)
  delete(fileId: number): void {
    const doc = this.documents.get(fileId);
    if (doc) {
      doc.destroy();
      this.documents.delete(fileId);
      this.updateCounts.delete(fileId);
    }
  }

  // Update 적용
  applyUpdate(fileId: number, update: Uint8Array): void {
    const doc = this.getOrCreate(fileId);
    Y.applyUpdate(doc, update);

    const count = (this.updateCounts.get(fileId) || 0) + 1;
    this.updateCounts.set(fileId, count);
  }

  shouldCreateSnapshot(fileId: number): boolean {
    const count = this.updateCounts.get(fileId) || 0;
    return count >= this.SNAPSHOT_THRESHOLD;
  }

  resetUpdateCount(fileId: number): void {
    this.updateCounts.set(fileId, 0);
  }

  encodeDocument(fileId: number): Uint8Array | null {
    const doc = this.documents.get(fileId);
    if (!doc) return null;

    return Y.encodeStateAsUpdate(doc);
  }
}
