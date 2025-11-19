import { Injectable, OnModuleInit } from '@nestjs/common';
import * as Y from 'yjs';

@Injectable()
export class NoteDocumentManager implements OnModuleInit {
  private documents = new Map<number, Y.Doc>();

  async onModuleInit() {
    await this.loadAllSnapshots();
  }

  // 서버 시작 시 모든 note 스냅샷 로드
  private async loadAllSnapshots(): Promise<void> {
    // TODO: 구현 필요
    // 1. FileSystem에서 .txt 파일 조회
    // 2. 각 파일의 contentUrl에서 스냅샷 로드
    // 3. Y.Doc 생성 및 적용
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
