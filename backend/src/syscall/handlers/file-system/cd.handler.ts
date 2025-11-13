import { Injectable } from '@nestjs/common';
import {
  ICommandHandler,
  CommandResult,
  CommandContext,
} from '../command.interface';
import { ProcessesRepository } from 'src/processes/processes.repository';
import { FileSystemService } from 'src/file-system/file-system.service';

@Injectable()
export class CdHandler implements ICommandHandler {
  constructor(
    private readonly processesRepo: ProcessesRepository,
    private readonly fileSystemService: FileSystemService,
  ) {}

  async execute(
    args: string[],
    data?: string,
    context?: CommandContext,
  ): Promise<CommandResult> {
    if (!context?.processId) {
      return {
        stdout: '',
        stderr: 'cd: process context required',
      };
    }

    // 인자 검증
    if (args.length === 0) {
      return {
        stdout: '',
        stderr: 'cd: missing operand',
      };
    }

    const targetPath = args[0];

    try {
      const process = await this.processesRepo.findOne(context.processId);
      if (!process) {
        return {
          stdout: '',
          stderr: 'cd: process not found',
        };
      }

      let newDirId: number;

      // 절대경로 처리
      if (targetPath.startsWith('/')) {
        // FileSystem 엔티티 직접 조회
        const targetNode =
          await this.fileSystemService.findNodeByAbsolutePath(targetPath);

        // 디렉토리 검증
        if (!targetNode.isDirectory()) {
          return {
            stdout: '',
            stderr: `cd: '${targetPath}': Not a directory`,
          };
        }

        newDirId = targetNode.id;
      } else {
        // 상대 경로 처리
        newDirId = await this.fileSystemService.resolveRelativePath(
          process.currentDirectoryId,
          targetPath,
        );
      }

      // 도메인 로직을 엔티티에 위임
      process.updateCurrentDir(newDirId);

      // 변경사항 저장
      await this.processesRepo.save(process);

      return {
        stdout: '', // cd는 성공 시 출력 없음
        stderr: '',
        cwd: await this.fileSystemService.buildPath(newDirId),
      };
    } catch (error) {
      return {
        stdout: '',
        stderr: `cd: ${error.message}`,
      };
    }
  }
}
