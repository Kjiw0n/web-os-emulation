import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Session } from './entities/session.entity';

@Injectable()
export class SessionsRepository {
  private repo: Repository<Session>;
  constructor(private readonly ds: DataSource) {
    this.repo = this.ds.getRepository(Session);
  }

  withManager(manager: EntityManager): SessionsRepository {
    const newRepo = new SessionsRepository(this.ds);
    newRepo.repo = manager.getRepository(Session);
    return newRepo;
  }

  findById(id: number): Promise<Session | null> {
    return this.repo.findOne({ where: { id } });
  }

  async deleteById(id: number): Promise<void> {
    await this.repo.delete({ id });
  }

  create(data: Partial<Session>): Session {
    return this.repo.create(data);
  }

  save(entity: Session): Promise<Session> {
    return this.repo.save(entity);
  }
}
