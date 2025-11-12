import { ProcessesRepository } from 'src/processes/processes.repository';
import {
  CommandContext,
  CommandResult,
  ICommandHandler,
} from '../command.interface';
import { FileSystemService } from 'src/file-system/file-system.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PwdHandler implements ICommandHandler {
  constructor(
    private readonly processesRepo: ProcessesRepository,
    private readonly fileSystemService: FileSystemService,
  ) {}

  async execute(
    args: string[],
    data?: string,
    context?: CommandContext,
  ): Promise<CommandResult> {
    if (!context?.processId) {
      return {
        stdout: '',
        stderr: 'pwd: process context required',
      };
    }

    const process = await this.processesRepo.findOne(context.processId);
    if (!process) {
      return {
        stdout: '',
        stderr: 'pwd: process not found',
      };
    }

    const path = await this.fileSystemService.buildPath(
      process.currentDirectoryId,
    );

    return {
      stdout: path,
    };
  }
}
