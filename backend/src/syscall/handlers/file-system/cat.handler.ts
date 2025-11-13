import { FileSystem } from 'src/file-system/entities/file-system.entity';
import { Injectable } from '@nestjs/common';
import { ICommandHandler, CommandContext, CommandResult } from '../command.interface';
import { FileSystemService } from 'src/file-system/file-system.service';

@Injectable()
export class CatHandler implements ICommandHandler {
  constructor(private readonly fileSystemService: FileSystemService) {}

  async execute(args: string[], _data: string, context: CommandContext): Promise<CommandResult> {
    if (!context.processId) {
      return { stdout: '', stderr: 'processId가 누락되었습니다.' };
    }

    const targetPath = args[0];
    if (!targetPath) {
      return { stdout: '', stderr: '파일 경로를 지정해주세요.' };
    }

    try {
      const content = await this.fileSystemService.readFile(context.processId, targetPath);
      return { stdout: content, stderr: '' };
    } catch (err) {
      if (err instanceof Error) return { stdout: '', stderr: err.message };
      return { stdout: '', stderr: '알 수 없는 오류가 발생했습니다.' };
    }
  }
}
