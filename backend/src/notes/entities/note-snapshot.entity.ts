import { FileSystem } from 'src/file-system/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('note_snapshots')
@Index('idx_file_version', ['fileId', 'version'], { unique: true })
export class NoteSnapshot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'file_id', type: 'int' })
  fileId: number;

  @ManyToOne(() => FileSystem)
  @JoinColumn({ name: 'file_id' })
  file: FileSystem;

  @Column({ name: 'storage_key', type: 'varchar', length: 500 })
  storageKey: string;

  @Column({ type: 'int' })
  version: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // ======================================
  // 도메인 불변식(invariants) 및 상태 검증 메서드
  // ======================================

  isLatestVersion(latestVersion: number): boolean {
    return this.version === latestVersion;
  }

  getStorageUrl(baseUrl: string): string {
    return `${baseUrl}/${this.storageKey}`;
  }

  static create(fileId: number, storageKey: string, version: number) {
    const noteSnapshot = new NoteSnapshot();
    noteSnapshot.fileId = fileId;
    noteSnapshot.storageKey = storageKey;
    noteSnapshot.version = version;
    return noteSnapshot;
  }
}
