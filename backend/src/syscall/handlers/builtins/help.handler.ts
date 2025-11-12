import { ICommandHandler, CommandResult } from '../command.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HelpHandler implements ICommandHandler {
  async execute(args: string[], data?: string): Promise<CommandResult> {
    const helpText = [
      '사용 가능한 명령어:',
      '- date: 현재 날짜 및 시간 표시',
      '- help: 명령어 목록 표시',
      '- uname: OS 이름 및 버전 표시',
    ].join('\n');
    return { stdout: helpText.trim(), stderr: '' };
  }
}
