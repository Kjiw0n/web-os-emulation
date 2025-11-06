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

@Entity('sessions')
@Index('idx_session_token', ['sessionToken'])
@Index('idx_session_active', ['isActive'])
@Index('idx_session_activity', ['lastActivityAt'])
@Index('idx_session_dir', ['currentDirectoryId'])
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'current_directory_id' })
  currentDirectoryId: number;

  @ManyToOne(() => FileSystem)
  @JoinColumn({ name: 'current_directory_id' })
  currentDirectory: FileSystem;

  @Column({ name: 'session_token', type: 'varchar', length: 255, unique: true })
  sessionToken: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({
    name: 'last_activity_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastActivityAt: Date;
}
