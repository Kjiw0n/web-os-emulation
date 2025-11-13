import { Injectable } from '@nestjs/common';
import { SyscallDto } from './dto/syscall.dto';
import {
  CommandContext,
  CommandResult,
  ICommandHandler,
} from './handlers/command.interface';
import { DateHandler } from './handlers/builtins/date.handler';
import { HelpHandler } from './handlers/builtins/help.handler';
import { ClearHandler } from './handlers/builtins/clear.handler';
import { LsHandler } from './handlers/file-system/ls.handler';
import { UnameHandler } from './handlers/builtins/uname.handler';
import { WriteHandler } from './handlers/file-system/write.handler';
import { PwdHandler } from './handlers/file-system/pwd.handler';
import { MkdirHandler } from './handlers/file-system/mkdir.handler';
import { CdHandler } from './handlers/file-system/cd.handler';
import { CatHandler } from './handlers/file-system/cat.handler';

@Injectable()
export class SyscallService {
  private readonly handlers = new Map<string, ICommandHandler>();

  constructor(
    private readonly dateHandler: DateHandler,
    private readonly helpHandler: HelpHandler,
    private readonly clearHandler: ClearHandler,
    private readonly lsHandler: LsHandler,
    private readonly unameHandler: UnameHandler,
    private readonly writeHandler: WriteHandler,
    private readonly pwdHandler: PwdHandler,
    private readonly mkdirHandler: MkdirHandler,
    private readonly cdHandler: CdHandler,
    private readonly catHandler: CatHandler
  ) {
    // 핸들러 등록
    this.handlers.set('date', this.dateHandler);
    this.handlers.set('help', this.helpHandler);
    this.handlers.set('clear', this.clearHandler);
    this.handlers.set('ls', this.lsHandler);
    this.handlers.set('uname', this.unameHandler);
    this.handlers.set('write', this.writeHandler);
    this.handlers.set('pwd', this.pwdHandler);
    this.handlers.set('mkdir', this.mkdirHandler);
    this.handlers.set('cd', this.cdHandler);
    this.handlers.set('cat', this.catHandler);
  }

  /**
   * 사용자가 입력한 명령어를 처리합니다.
   * 주어진 명령어 문자열을 파싱하여 적절한 핸들러를 찾고 실행합니다.
   *
   * @param {SyscallDto} syscallDto - 실행할 명령어와 데이터를 포함한 DTO
   * @param {string} syscallDto.command - 공백으로 구분된 명령어 문자열 (예: "ls /home")
   * @param {string} syscallDto.data - 명령어 실행에 필요한 추가 데이터
   * @returns {Promise<CommandResult>} 명령어 실행 결과 (stdout, stderr)
   * @throws {Error} 명령어 실행 중 발생한 에러는 stderr에 포함되어 반환됩니다.
   */
  async handleCommand(syscallDto: SyscallDto): Promise<CommandResult> {
    const { processId, command, data } = syscallDto;

    // 공백 기준 명령어 문자열 파싱
    const [commandName, ...args] = command.split(' ');

    // Map을 사용해서 실행할 핸들러를 찾음
    const handler = this.handlers.get(commandName);

    if (!handler) {
      return {
        stdout: '',
        stderr: `command not found: ${commandName}`,
      };
    }

    try {
      const context: CommandContext = { processId };
      // 핸들러에 작업 위임 (args, data, context 전달)
      return await handler.execute(args, data, context);
    } catch (err) {
      return {
        stdout: '',
        stderr: err instanceof Error ? err.message : 'Unknown error occurred',
      };
    }
  }
}
