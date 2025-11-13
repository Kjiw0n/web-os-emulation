import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWindowDto } from './dto/create-window.dto';
import { UpdateWindowDto } from './dto/update-window.dto';
import { DataSource } from 'typeorm';
import { WindowsRepository } from './windows.repository';
import { FileSystemRepository } from 'src/file-system/file-system.repository';
import { Window } from './entities';
import { CreateWindowResponseDto } from './dto';
import { ProcessesRepository } from 'src/processes/processes.repository';
import { Process } from 'src/processes/entities';

@Injectable()
export class WindowsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly windowsRepo: WindowsRepository,
    private readonly fileSystemRepo: FileSystemRepository,
    private readonly processesRepo: ProcessesRepository,
  ) {}

  async create(dto: CreateWindowDto): Promise<CreateWindowResponseDto> {
    const result = this.dataSource.transaction(async (manager) => {
      const txWindowRepo = this.windowsRepo.withManager(manager);
      const txFileSystemRepo = this.fileSystemRepo.withManager(manager);
      const txProcessRepo = this.processesRepo.withManager(manager);

      // 1. 최대 z_index 조회 (FOR UPDATE)
      const topWindow = await txWindowRepo.getTopWindowForUpdate();
      const nextZIndex = topWindow ? topWindow.zIndex + 1 : 1;

      // 2. Process 생성
      const programName = dto.program ?? 'shell';

      const rootDir = await txFileSystemRepo.findByDirName('/');
      if (!rootDir) {
        throw new NotFoundException(
          'Root directory not found. Please run seed.',
        );
      }

      const process = Process.create(programName, null, rootDir.id);

      const savedProcess = await txProcessRepo.save(process);
      const processId = savedProcess.id;

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
