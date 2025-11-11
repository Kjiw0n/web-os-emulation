import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ name: 'process_id', type: 'int', nullable: true })
  processId: number | null;

  static create(
    title: string,
    x: number,
    y: number,
    width: number,
    height: number,
    zIndex: number,
    processId: number | null = null,
  ): Window {
    const window = new Window();
    window.title = title;
    window.x = x;
    window.y = y;
    window.width = width;
    window.height = height;
    window.zIndex = zIndex;
    window.isOpen = true;
    window.processId = processId;

    return window;
  }
}
