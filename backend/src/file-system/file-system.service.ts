import { Injectable } from '@nestjs/common';
import { CreateFileSystemDto } from './dto/create-file-system.dto';
import { UpdateFileSystemDto } from './dto/update-file-system.dto';

@Injectable()
export class FileSystemService {
  create(createFileSystemDto: CreateFileSystemDto) {
    return 'This action adds a new fileSystem';
  }

  findAll() {
    return `This action returns all fileSystem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fileSystem`;
  }

  update(id: number, updateFileSystemDto: UpdateFileSystemDto) {
    return `This action updates a #${id} fileSystem`;
  }

  remove(id: number) {
    return `This action removes a #${id} fileSystem`;
  }
}
