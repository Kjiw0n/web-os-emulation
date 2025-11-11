import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { FileSystem } from './entities/file-system.entity';

@Injectable()
export class FileSystemRepository {
  private repo: Repository<FileSystem>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(FileSystem);
  }

  withManager(manager: EntityManager): FileSystemRepository {
    const newRepo = new FileSystemRepository(this.dataSource);
    newRepo.repo = manager.getRepository(FileSystem);
    return newRepo;
  }

  async findByDirName(name: string): Promise<FileSystem | null> {
    return this.repo.findOne({ where: { name } });
  }

  async save(fileSystem: FileSystem): Promise<FileSystem> {
    return this.repo.save(fileSystem);
  }
}
