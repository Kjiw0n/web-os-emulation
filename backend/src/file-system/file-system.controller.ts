import { Controller } from '@nestjs/common';
import { FileSystemService } from './file-system.service';

@Controller('file-system')
export class FileSystemController {
  constructor(private readonly fileSystemService: FileSystemService) {}
}
