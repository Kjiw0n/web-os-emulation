import { Injectable } from '@nestjs/common';
import { CommandContext, CommandResult, ICommandHandler } from '../command.interface';
import { FileSystemService } from 'src/file-system/file-system.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Process } from 'src/processes/entities/process.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WriteHandler implements ICommandHandler {
  constructor(
    private readonly fileSystemService: FileSystemService,
    @InjectRepository(Process)
    private readonly processRepository: Repository<Process>,
  ) {}

  async execute(args: string[], _data:string, context: CommandContext): Promise<CommandResult> {
    const dataIndex = args.indexOf('data');

    if (dataIndex === -1) {
      return { 
        stdout: '', 
        stderr: "형식이 올바르지 않습니다. 예: write <경로> data <내용>" };
    }

    const targetPath = args[dataIndex - 1];
    const content = args.slice(dataIndex + 1).join(' ');
    const processId = context.processId;

    if (!processId) {
      return { stdout: '', stderr: 'processId가 누락되었습니다.' };
    }

    // 현재 프로세스의 작업 디렉토리 조회
    const proc = await this.processRepository.findOneBy({ id: processId });
    if (!proc) {
      return { stdout: '', stderr: `프로세스 ID ${processId}를 찾을 수 없습니다.` };
    }

    try{
      let directoryPath: string;
      let fileName: string;

      if (targetPath.startsWith('/')) {
        // 절대 경로
        const segments = targetPath.split('/').filter(Boolean);
        fileName = segments.pop()!;
        directoryPath = '/' + segments.join('/');
    }else {
        // 상대 경로
        const segments = targetPath.split('/').filter(Boolean);
        fileName = segments.pop()!;
        const relativeDir = segments.join('/');
        const targetDirId = await this.fileSystemService.resolveRelativePath(
          proc.currentDirectoryId,
          relativeDir || '.',
        );
        directoryPath = await this.fileSystemService.buildPath(targetDirId);
      }

      const fileNode = await this.fileSystemService.writeFile(directoryPath, fileName, content);

      return { stdout: `파일 '${fileNode.name}'에 데이터를 성공적으로 작성했습니다.`, stderr: '' };
    } catch (err) {
      if (err instanceof Error) {
        return { stdout: '', stderr: err.message };
      }
      return { stdout: '', stderr: '알 수 없는 오류가 발생했습니다.' };
    }
  }
}
