import { Injectable } from '@nestjs/common';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { Process } from './entities';
import { ProcessStatus } from './types';

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

  async save(process: Process): Promise<Process> {
    return this.repo.save(process);
  }

  async findOne(id: number): Promise<Process | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByStatus(status: ProcessStatus): Promise<Process[]> {
    return this.repo.find({ where: { status } });
  }

  async findRunningProcesses(): Promise<Process[]> {
    return this.findByStatus(ProcessStatus.RUNNING);
  }
}
