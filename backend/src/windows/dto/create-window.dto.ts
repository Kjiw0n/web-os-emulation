import {
  IsString,
  IsInt,
  IsEnum,
  IsOptional,
  Min,
  MaxLength,
} from 'class-validator';
import { WindowType } from '../types';

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

  @IsEnum(WindowType)
  @IsOptional()
  windowType?: WindowType = WindowType.TERMINAL;
}
