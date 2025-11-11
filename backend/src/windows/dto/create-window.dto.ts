import { IsString, IsInt, Min, MaxLength, IsOptional } from 'class-validator';

export class CreateWindowDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsInt()
  x: number;

  @IsInt()
  y: number;

  @IsInt()
  @Min(100)
  width: number;

  @IsInt()
  @Min(100)
  height: number;

  @IsOptional()
  @IsString()
  program?: string;
}
