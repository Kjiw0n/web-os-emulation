import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateNotesDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  content?: string;
}
