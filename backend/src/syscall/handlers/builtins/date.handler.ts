import { Injectable } from '@nestjs/common';
import { ICommandHandler, CommandResult } from '../command.interface';

@Injectable()
export class DateHandler implements ICommandHandler {
  async execute(args: string[], data?: string): Promise <CommandResult> {
    const now = new Date().toString();
    return { stdout: now };
  }
}
