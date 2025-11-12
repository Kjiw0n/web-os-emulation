import { ProcessesRepository } from 'src/processes/processes.repository';
import {
  CommandContext,
  CommandResult,
  ICommandHandler,
} from '../command.interface';
import { FileSystemRepository } from 'src/file-system/file-system.repository';
import { FileSystem } from 'src/file-system/entities/file-system.entity';
import { FileType } from 'src/file-system/types/file-type.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MkdirHandler implements ICommandHandler {
  constructor(
    private readonly processesRepo: ProcessesRepository,
    private readonly fileSystemRepo: FileSystemRepository,
  ) {}

  async execute(
    args: string[],
    _data?: string,
    context?: CommandContext,
  ): Promise<CommandResult> {
    if (!args || args.length === 0) {
      return {
        stdout: '',
        stderr: 'mkdir: 디렉토리 이름이 필요합니다.',
      };
    }

    const dirName = args[0];

    // 1단계: 현재 경로 가져오기 (프로세스 current_directory_id)
    if (!context?.processId) {
      return {
        stdout: '',
        stderr: 'mkdir: process context required',
      };
    }

    const process = await this.processesRepo.findOne(context.processId);
    if (!process) {
      return {
        stdout: '',
        stderr: 'mkdir: process not found',
      };
    }

    const currentDirectoryId = process.currentDirectoryId;

    // 2단계: 파일 시스템 레포지토리에 새로운 디렉토리 기록
    try {
      // 동일한 이름의 자식 디렉토리가 이미 존재하는지 확인
      const existingNode = await this.fileSystemRepo.findChildByName(
        currentDirectoryId,
        dirName,
      );

      if (existingNode) {
        return {
          stdout: '',
          stderr: `mkdir: '${dirName}' 디렉토리가 이미 존재합니다.`,
        };
      }

      // 새로운 디렉토리 엔티티 생성
      const newDirectory = new FileSystem();
      newDirectory.parentId = currentDirectoryId;
      newDirectory.name = dirName;
      newDirectory.type = FileType.DIRECTORY;
      newDirectory.permissions = 'rwx';
      newDirectory.size = '0';

      // 데이터베이스에 저장
      await this.fileSystemRepo.save(newDirectory);

      return {
        stdout: '',
        stderr: '',
      };
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
}
