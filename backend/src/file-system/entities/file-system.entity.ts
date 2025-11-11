import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FileType } from '../types';

@Entity('file_system')
@Index('idx_fs_parent', ['parentId'])
@Index('idx_fs_type_parent', ['type', 'parentId'])
export class FileSystem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'parent_id', type: 'int', nullable: true })
  parentId: number | null;

  @ManyToOne(() => FileSystem, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: FileSystem | null;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'enum', enum: FileType })
  type: FileType;

  @Column({
    name: 'physical_path',
    type: 'varchar',
    length: 768,
    nullable: true,
  })
  physicalPath: string | null;

  @Column({ type: 'varchar', name: 'img_url', nullable: true })
  imgUrl: string | null;

  /**
   * number인 경우 2GB 이상 파일은 오버플로우 가능해서 string으로 처리
   * bigint인 경우 JSON 직렬화 제한
   */
  @Column({ type: 'bigint', default: 0 })
  size: string;

  @Column({
    name: 'file_extension',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  fileExtension: string | null;

  @Column({ type: 'varchar', length: 10, default: 'rwx' })
  permissions: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
