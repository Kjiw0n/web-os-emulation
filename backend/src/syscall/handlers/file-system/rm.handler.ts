import { Injectable } from '@nestjs/common';
import { ProcessesRepository } from 'src/processes/processes.repository';
import {
  CommandContext,
  CommandResult,
  ICommandHandler,
} from '../command.interface';
import { FileSystemService } from 'src/file-system/file-system.service';
import { FileSystemRepository } from 'src/file-system/file-system.repository';
import { FileType } from 'src/file-system/types';
import { FileSystem } from 'src/file-system/entities/file-system.entity';

@Injectable()
export class RmHandler implements ICommandHandler {
  constructor(
    private readonly processesRepo: ProcessesRepository,
    private readonly fileSyetemRepo: FileSystemRepository,
    private readonly fileSystemService: FileSystemService,
  ) {}

  async execute(
    args: string[],
    _data?: string,
    context?: CommandContext,
  ): Promise<CommandResult> {
    if (!args || args.length === 0) {
      return {
        stdout: '',
        stderr: 'rm: directory or file name required',
      };
    }
    const path = args[0];

    if (!context?.processId) {
      return {
        stdout: '',
        stderr: 'rm: process context required',
      };
    }

    try {
      let fileSystemEntity: FileSystem | null = null;

      if (path.startsWith('/')) {
        // 절대 경로 처리
        fileSystemEntity =
          await this.fileSystemService.findNodeByAbsolutePath(path);
      } else if (path.includes('/')) {
        // 상대 경로 처리
        const process = await this.processesRepo.findOne(context?.processId);
        if (!process) {
          return {
            stdout: '',
            stderr: 'rm: process not found',
          };
        }

        const relativePathId = await this.fileSystemService.resolveRelativePath(
          process.currentDirectoryId,
          path,
        );

        const absolutePath =
          await this.fileSystemService.buildPath(relativePathId);

        fileSystemEntity =
          await this.fileSystemService.findNodeByAbsolutePath(absolutePath);
      } else {
        // 단순 파일명 입력 처리
        const process = await this.processesRepo.findOne(context?.processId);
        if (!process) {
          return {
            stdout: '',
            stderr: 'rm: process not found',
          };
        }

        fileSystemEntity = await this.fileSyetemRepo.findChildByName(
          process.currentDirectoryId,
          path,
        );
      }

      if (!fileSystemEntity) {
        return {
          stdout: '',
          stderr: `rm: cannot remove '${path}': No such file or directory`,
        };
      }

      if (fileSystemEntity.type === FileType.DIRECTORY) {
        return {
          stdout: '',
          stderr: `rm: cannot remove '${path}': Is a directory`,
        };
      }

      await this.fileSyetemRepo.deleteById(fileSystemEntity.id);

      return { stdout: '', stderr: '' };
    } catch (err) {
      if (err instanceof Error) {
        return {
          stdout: '',
          stderr: `rm: error: ${err.message}`,
        };
      }
      return {
        stdout: '',
        stderr: 'rm: unexpected error occured',
      };
    }
  }
}
