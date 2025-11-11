import { Injectable } from '@nestjs/common';
import { CommandResult, ICommandHandler } from '../command.interface';
import { FileSystemService } from 'src/file-system/file-system.service';

@Injectable()
export class LsHandler implements ICommandHandler {
  constructor(private readonly fileSystemService: FileSystemService) {}

  async execute(args: string[]): Promise<CommandResult> {
    const path = args[0];

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
    }

    // TODO: 현재 디렉토리 (CWD) 로직이 추가된 후 상대 경로 및 args가 없을 때 처리 로직 작성
    return { stdout: '', stderr: '현재는 절대 경로만 지원합니다.' };
  }
}
