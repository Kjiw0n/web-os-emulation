import { Injectable } from '@nestjs/common';
import { CommandResult, ICommandHandler } from '../command.interface';
import { FileSystemService } from 'src/file-system/file-system.service';

@Injectable()
export class WriteHandler implements ICommandHandler {
  constructor(private readonly fileSystemService: FileSystemService) {}

  async execute(args: string[]): Promise<CommandResult> {
    // 명령어 형식: write <경로> data <내용>
    // 예: write /home/usr/hello.txt data 안녕하세요! S3에 저장됩니다.
    const dataIndex = args.indexOf('data');

    if (dataIndex === -1) {
      return { stdout: '', stderr: "형식이 올바르지 않습니다. 예: write /path/to/file.txt data 내용" };
    }

    const fullPath = args[dataIndex - 1];
    const content = args.slice(dataIndex + 1).join(' '); // 'data' 이후의 모든 문자열을 내용으로

    if (!fullPath || !fullPath.startsWith('/')) {
      return { stdout: '', stderr: '절대 경로를 올바르게 지정해주세요.' };
    }

    try {
      const segments = fullPath.split('/').filter(Boolean);
      const fileName = segments.pop()!;
      const dirPath = '/' + segments.join('/');

      const fileNode = await this.fileSystemService.writeFile(dirPath, fileName, content);

      return { stdout: `파일 '${fileNode.name}'이 성공적으로 생성되었습니다.`, stderr: '' };
    } catch (err) {
      if (err instanceof Error) return { stdout: '', stderr: err.message };
      return { stdout: '', stderr: '알 수 없는 오류가 발생했습니다.' };
    }
  }
}
