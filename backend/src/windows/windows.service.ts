import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWindowDto } from './dto/create-window.dto';
import { UpdateWindowDto } from './dto/update-window.dto';
import { DataSource } from 'typeorm';
import { WindowsRepository } from './windows.repository';
import { SessionsRepository } from 'src/sessions/sessions.repository';
import { FileSystemRepository } from 'src/file-system/file-system.repository';
import { Window } from './entities';
import { WindowType } from './types';
import { Session } from 'src/sessions/entities';
import { CreateWindowResponseDto } from './dto';

@Injectable()
export class WindowsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly windowsRepo: WindowsRepository,
    private readonly sessionsRepo: SessionsRepository,
    private readonly fileSystemRepo: FileSystemRepository,
  ) {}

  async create(dto: CreateWindowDto): Promise<CreateWindowResponseDto> {
    const result = this.dataSource.transaction(async (manager) => {
      const txWindowRepo = this.windowsRepo.withManager(manager);
      const txSessionRepo = this.sessionsRepo.withManager(manager);
      const txFileSystemRepo = this.fileSystemRepo.withManager(manager);

      // 1. 최대 z_index 조회 (FOR UPDATE)
      const topWindow = await txWindowRepo.getTopWindowForUpdate();
      const nextZIndex = topWindow ? topWindow.zIndex + 1 : 1;

      // 2. window_type이 terminal이면 세션 생성
      let sessionId: number | undefined;
      if (dto.windowType === WindowType.TERMINAL) {
        const rootDir = await txFileSystemRepo.getRootDirectory();
        if (!rootDir) {
          throw new NotFoundException(
            'Root directory not found. Please run seed.',
          );
        }

        const session = Session.create(rootDir.id);
        const savedSession = await txSessionRepo.save(session);
        sessionId = savedSession.id;
      }

      // 3. Window 생성
      const window = Window.create(
        dto.title,
        dto.x,
        dto.y,
        dto.width,
        dto.height,
        nextZIndex,
        dto.windowType || WindowType.TERMINAL,
        sessionId,
      );

      const savedWindow = await txWindowRepo.save(window);

      return {
        windowId: savedWindow.id,
        title: savedWindow.title,
        x: savedWindow.x,
        y: savedWindow.y,
        z: savedWindow.zIndex,
        width: savedWindow.width,
        height: savedWindow.height,
      };
    });

    return result;
  }

  findAll() {
    return `This action returns all windows`;
  }

  findOne(id: number) {
    return `This action returns a #${id} window`;
  }

  update(id: number, updateWindowDto: UpdateWindowDto) {
    return `This action updates a #${id} window`;
  }

  remove(id: number) {
    return `This action removes a #${id} window`;
  }
}
