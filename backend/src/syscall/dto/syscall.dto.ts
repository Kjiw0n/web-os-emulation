import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SyscallDto {
  @IsInt()
  @IsNotEmpty()
  readonly processId: number;

  @IsString()
  @IsNotEmpty()
  readonly command: string; // e.g. "help", "write hello.txt"

  @IsOptional()
  @IsString()
  readonly data?: string;
}
