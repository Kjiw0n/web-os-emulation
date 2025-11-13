import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, Min, MaxLength, IsOptional } from 'class-validator';

export class CreateWindowDto {
  @ApiProperty({
    description: '윈도우 제목',
    example: 'My Window',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: '윈도우 X 좌표',
    example: 100,
  })
  @IsInt()
  x: number;

  @ApiProperty({
    description: '윈도우 Y 좌표',
    example: 100,
  })
  @IsInt()
  y: number;

  @ApiProperty({
    description: '윈도우 너비',
    example: 800,
    minimum: 100,
  })
  @IsInt()
  @Min(100)
  width: number;

  @ApiProperty({
    description: '윈도우 높이',
    example: 600,
    minimum: 100,
  })
  @IsInt()
  @Min(100)
  height: number;

  @ApiPropertyOptional({
    description: '실행할 프로그램 이름',
    example: 'terminal',
  })
  @IsOptional()
  @IsString()
  program?: string;
}
