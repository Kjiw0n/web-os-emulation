import { Injectable } from '@nestjs/common';
import {
  CommandContext,
  CommandResult,
  ICommandHandler,
} from '../command.interface';
import { FileSystemService } from 'src/file-system/file-system.service';
import { ProcessesRepository } from 'src/processes/processes.repository';

@Injectable()
export class LsHandler implements ICommandHandler {
  constructor(
    private readonly fileSystemService: FileSystemService,
    private readonly processesRepo: ProcessesRepository,
  ) {}

  async execute(
    args: string[],
    _data?: string,
    context?: CommandContext,
  ): Promise<CommandResult> {
    const path = args[0] || '.';

    if (!context?.processId) {
      return {
        stdout: '',
        stderr: 'mkdir: process context required',
      };
    }

    // 절대 경로 처리
    if (path.startsWith('/')) {
      try {
        const childrenNodes = await this.fileSystemService.listDirectory(path);

        const output = childrenNodes.map((node) => node.name).join(' ');

        return { stdout: output, stderr: '' };
      } catch (err) {
        if (err instanceof Error) return { stdout: '', stderr: err.message };
        return { stdout: '', stderr: '알 수 없는 오류가 발생했습니다.' };
      }
    } else {
      // 상대 경로 처리
      const process = await this.processesRepo.findOne(context?.processId);
      if (!process) {
        return {
          stdout: '',
          stderr: 'mkdir: process not found',
        };
      }

      try {
        const currentDirectoryId = process?.currentDirectoryId;

        const relativePathId = await this.fileSystemService.resolveRelativePath(
          currentDirectoryId,
          path,
        );

        const absolutePath =
          await this.fileSystemService.buildPath(relativePathId);

        const childrenNodes =
          await this.fileSystemService.listDirectory(absolutePath);

        const output = childrenNodes.map((node) => node.name).join(' ');

        return { stdout: output, stderr: '' };
      } catch (err) {
        if (err instanceof Error) {
          return {
            stdout: '',
            stderr: `mkdir: 오류 - ${err.message}`,
          };
        }
        return {
          stdout: '',
          stderr: 'mkdir: 알 수 없는 오류가 발생했습니다.',
        };
      }
    }

    return { stdout: '', stderr: '현재는 절대 경로만 지원합니다.' };
  }
}
