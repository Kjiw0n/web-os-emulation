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

    try {
      // 경로 결정
      let absolutePath: string;

      if (path.startsWith('/')) {
        // 절대 경로
        absolutePath = path;
      } else {
        // 상대 경로
        const process = await this.processesRepo.findOne(context?.processId);
        if (!process) {
          return {
            stdout: '',
            stderr: 'mkdir: process not found',
          };
        }

        const relativePathId = await this.fileSystemService.resolveRelativePath(
          process.currentDirectoryId,
          path,
        );

        absolutePath = await this.fileSystemService.buildPath(relativePathId);
      }

      // 디렉토리 내용 조회
      const childrenNodes =
        await this.fileSystemService.listDirectory(absolutePath);

      const output = childrenNodes.map((node) => node.name).join(' ');

      return { stdout: output, stderr: '' };
    } catch (err) {
      if (err instanceof Error) {
        return {
          stdout: '',
          stderr: `mkdir: error: ${err.message}`,
        };
      }
      return {
        stdout: '',
        stderr: 'mkdir: unexpected error occured',
      };
    }
  }
}
