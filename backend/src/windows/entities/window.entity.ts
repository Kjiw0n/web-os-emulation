import { Session } from 'src/sessions/entities';
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
import { WindowType } from '../types';

@Entity('windows')
@Index('idx_window_open', ['isOpen'])
@Index('idx_window_z', ['zIndex'])
@Index('idx_window_open_z', ['isOpen', 'zIndex'])
export class Window {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'int', default: 0 })
  x: number;

  @Column({ type: 'int', default: 0 })
  y: number;

  // FIXME: 일단 최대 z_index에 +1 하는 방식으로 새창의 z_index 설정.
  @Column({ name: 'z_index', type: 'int', default: 0 })
  zIndex: number;

  @Column({ type: 'int', default: 800 })
  width: number;

  @Column({ type: 'int', default: 600 })
  height: number;

  @Column({ name: 'is_open', type: 'boolean', default: true })
  isOpen: boolean;

  @Column({ name: 'is_minimized', type: 'boolean', default: false })
  isMinimized: boolean;

  @Column({ name: 'is_maximized', type: 'boolean', default: false })
  isMaximized: boolean;

  @Column({ name: 'process_id', type: 'int', nullable: true })
  processId: number | null;

  @Column({
    name: 'window_type',
    type: 'enum',
    enum: WindowType,
    default: WindowType.TERMINAL,
  })
  windowType: WindowType;

  // FIXME: 외래키 제약 조건을 사용 할 것인지 논의 필요.
  @Column({ name: 'session_id', type: 'int', nullable: true })
  sessionId: number | null;

  @ManyToOne(() => Session, { nullable: true })
  @JoinColumn({ name: 'session_id' })
  session: Session | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  static create(
    title: string,
    x: number,
    y: number,
    width: number,
    height: number,
    zIndex: number,
    windowType: WindowType = WindowType.TERMINAL,
    sessionId?: number,
  ): Window {
    // 코드 레벨에서 Terminal 생성 시 sessionId를 필수값으로 검증
    if (windowType === WindowType.TERMINAL && !sessionId) {
      throw new Error('Terminal window requires sessionId');
    }

    const window = new Window();
    window.title = title;
    window.x = x;
    window.y = y;
    window.width = width;
    window.height = height;
    window.zIndex = zIndex;
    window.windowType = windowType;
    window.sessionId = sessionId ?? null;
    window.isOpen = true;

    return window;
  }
}
