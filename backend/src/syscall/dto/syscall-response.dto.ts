import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SyscallResponseDto {
  @ApiProperty({
    description: '표준 출력 결과',
    example: 'file1.txt\nfile2.txt',
  })
  stdout: string;

  @ApiPropertyOptional({
    description: '표준 에러 출력',
    example: 'command not found: invalid',
  })
  stderr?: string;

  @ApiPropertyOptional({
    description: '현재 작업 디렉토리',
    example: '/home/user',
  })
  cwd?: string;
}
