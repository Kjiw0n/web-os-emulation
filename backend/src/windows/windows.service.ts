import { Injectable } from '@nestjs/common';
import { CreateWindowDto } from './dto/create-window.dto';
import { UpdateWindowDto } from './dto/update-window.dto';

@Injectable()
export class WindowsService {
  create(createWindowDto: CreateWindowDto) {
    return 'This action adds a new window';
  }

  findAll() {
    return `This action returns all windows`;
  }

  findOne(id: number) {
    return `This action returns a #${id} window`;
  }

  update(id: number, updateWindowDto: UpdateWindowDto) {
    return `This action updates a #${id} window`;
  }

  remove(id: number) {
    return `This action removes a #${id} window`;
  }
}
