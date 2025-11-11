import { Injectable } from '@nestjs/common';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { Process } from './entities';

@Injectable()
export class ProcessesRepository {
  private repo: Repository<Process>;
  constructor(private readonly ds: DataSource) {
    this.repo = this.ds.getRepository(Process);
  }

  withManager(manager: EntityManager): ProcessesRepository {
    const newRepo = new ProcessesRepository(this.ds);
    newRepo.repo = manager.getRepository(Process);
    return newRepo;
  }
}
