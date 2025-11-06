import { Injectable } from '@nestjs/common';
import { SyscallDto } from './dto/syscall.dto';
import { CommandResult, ICommandHandler } from './handlers/command.interface';
import { DateHandler } from './handlers/builtins/date.handler';

@Injectable()
export class SyscallService {
  private readonly handlers = new Map<string, ICommandHandler>();

  constructor(
    private readonly dateHandler: DateHandler,
  ){
    // 핸들러 등록
    this.handlers.set('date', this.dateHandler);
  }
  
  // TODO: DI를 통해서 각 핸들러를 주입받아야 함
  // TODO: 모듈이 초기화될 때 핸들러를 handlers Map에 등록해야 함

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
    const { command, data } = syscallDto;

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
      // 핸들러에 작업 위임 (args, data 전달)
      return await handler.execute(args, data);
    } catch (err) {
    return {
      stdout: '',
      stderr: err instanceof Error
        ? err.message
        : 'Unknown error occurred',
    };
    }
  }
}
