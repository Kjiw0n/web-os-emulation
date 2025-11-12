import {
  CommandContext,
  CommandResult,
  ICommandHandler,
} from '../command.interface';

export class MkdirHandler implements ICommandHandler {
  execute(
    args: string[],
    _data?: string,
    context?: CommandContext,
  ): Promise<CommandResult> | CommandResult {}
}
