import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SyscallDto {
  @ApiProperty({
    description: '프로세스 ID',
    example: 1234,
  })
  @IsInt()
  @IsNotEmpty()
  readonly processId: number;

  @ApiProperty({
    description: '실행할 명령어',
    example: 'write hello.txt',
    examples: ['help', 'write hello.txt', 'ls'],
  })
  @IsString()
  @IsNotEmpty()
  readonly command: string; // e.g. "help", "write hello.txt"

  @ApiPropertyOptional({
    description: '추가 데이터',
    example: 'Hello, World!',
  })
  @IsOptional()
  @IsString()
  readonly data?: string;
}
