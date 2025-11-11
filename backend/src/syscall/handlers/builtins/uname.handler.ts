import { ICommandHandler, CommandResult } from "../command.interface";
import { Injectable } from "@nestjs/common";
import * as os from 'os';

@Injectable()
export class UnameHandler implements ICommandHandler {
  async execute(args: string[], data?: string): Promise<CommandResult> {
    try{
        const platform = os.platform();
        const release = os.release();
        const arch = os.arch();

        const unameText = `${platform} ${release} ${arch}`;
        return { stdout: unameText.trim(), stderr: '' };
        } catch (error) {
        return { stdout: '', stderr: error.message };
    }
  }
}