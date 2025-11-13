import { ICommandHandler, CommandResult } from '../command.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClearHandler implements ICommandHandler {
  async execute(args: string[], data?: string): Promise<CommandResult> {
    return { stdout: 'CLEAR', stderr: '' };
  }
}
