import { ApiProperty } from '@nestjs/swagger';

export class CreateWindowResponseDto {
  @ApiProperty({
    description: '생성된 윈도우 ID',
    example: 1,
  })
  windowId: number;

  @ApiProperty({
    description: '윈도우 제목',
    example: 'My Window',
  })
  title: string;

  @ApiProperty({ description: 'X 좌표', example: 100 })
  x: number;

  @ApiProperty({ description: 'Y 좌표', example: 100 })
  y: number;

  @ApiProperty({ description: 'Z-index', example: 1 })
  z: number;

  @ApiProperty({ description: '너비', example: 800 })
  width: number;

  @ApiProperty({ description: '높이', example: 600 })
  height: number;

  @ApiProperty({
    description: '연결된 프로세스 ID',
    example: 123,
    nullable: true,
  })
  processId: number | null;

  @ApiProperty({
    description: '프로그램 이름',
    example: 'terminal',
  })
  programName: string;
}
