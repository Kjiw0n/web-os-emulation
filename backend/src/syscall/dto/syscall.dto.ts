import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SyscallDto {
  @IsString()
  @IsNotEmpty()
  readonly command: string; // e.g. "help", "write hello.txt"

  @IsOptional()
  @IsString()
  readonly data?: string;
}
