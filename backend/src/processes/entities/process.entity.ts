import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FileSystem } from 'src/file-system/entities';
import { ProcessStatus } from '../types';

@Entity('processes')
@Index('idx_process_status', ['status'])
@Index('idx_process_started', ['startedAt'])
export class Process {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'file_id', type: 'int', nullable: true })
  fileId: number | null;

  @ManyToOne(() => FileSystem, { nullable: true })
  @JoinColumn({ name: 'file_id' })
  file: FileSystem | null;

  @Column({ name: 'current_directory_id', type: 'int' })
  currentDirectoryId: number;

  @ManyToOne(() => FileSystem)
  @JoinColumn({ name: 'current_directory_id' })
  currentDirectory: FileSystem;

  @Column({
    type: 'enum',
    enum: ProcessStatus,
    default: ProcessStatus.RUNNING,
  })
  status: ProcessStatus;

  @Column({ name: 'exit_code', type: 'int', nullable: true })
  exitCode: number | null;

  @CreateDateColumn({ name: 'started_at' })
  startedAt: Date;

  @Column({ name: 'ended_at', type: 'timestamp', nullable: true })
  endedAt: Date | null;

  static create(
    name: string,
    fileId: number | null,
    currentDirectoryId: number,
  ): Process {
    const process = new Process();
    process.name = name;
    process.fileId = fileId;
    process.currentDirectoryId = currentDirectoryId;
    process.status = ProcessStatus.RUNNING;
    process.exitCode = null;
    process.endedAt = null;

    return process;
  }

  // ===== 도메인 로직 =====

  /**
   * 현재 디렉토리 변경
   * @param newDirId - 새 디렉토리 ID
   * @throws {Error} 프로세스가 종료된 경우
   */
  updateCurrentDir(newDirId: number): void {
    // 도메인 규칙: 종료된 프로세스는 디렉토리 변경 불가
    if (this.isStoped()) {
      throw new Error('정지된 프로세스는 디렉토리를 변경할 수 없습니다.');
    }

    this.currentDirectoryId = newDirId;
  }

  /**
   * 프로세스 종료 여부
   */
  isStoped(): boolean {
    return this.status === ProcessStatus.STOPPED;
  }
}
