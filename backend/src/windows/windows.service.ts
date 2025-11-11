import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWindowDto } from './dto/create-window.dto';
import { UpdateWindowDto } from './dto/update-window.dto';
import { DataSource } from 'typeorm';
import { WindowsRepository } from './windows.repository';
import { FileSystemRepository } from 'src/file-system/file-system.repository';
import { Window } from './entities';
import { CreateWindowResponseDto } from './dto';

@Injectable()
export class WindowsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly windowsRepo: WindowsRepository,
    private readonly fileSystemRepo: FileSystemRepository,
  ) {}

  async create(dto: CreateWindowDto): Promise<CreateWindowResponseDto> {
    const result = this.dataSource.transaction(async (manager) => {
      const txWindowRepo = this.windowsRepo.withManager(manager);
      const txFileSystemRepo = this.fileSystemRepo.withManager(manager);

      // 1. 최대 z_index 조회 (FOR UPDATE)
      const topWindow = await txWindowRepo.getTopWindowForUpdate();
      const nextZIndex = topWindow ? topWindow.zIndex + 1 : 1;

      // 2. Process 생성
      const programName = dto.program || 'shell'; // 기본값: shell

      const rootDir = await txFileSystemRepo.findByDirName('root');
      if (!rootDir) {
        throw new NotFoundException(
          'Root directory not found. Please run seed.',
        );
      }

      // TODO: Process 생성
      // const process = Process.create(
      //   programName,           // name
      //   null,                  // file_id (시스템 프로세스)
      //   rootDir.id             // current_directory_id
      // );
      // const savedProcess = await txProcessRepo.save(process);
      // const processId = savedProcess.id;

      // 임시: Process 구현 전까지는 임시값
      const processId = 1;

      // 3. Window 생성
      const window = Window.create(
        dto.title,
        dto.x,
        dto.y,
        dto.width,
        dto.height,
        nextZIndex,
        processId,
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
        processId: savedWindow.processId,
        programName: programName,
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
