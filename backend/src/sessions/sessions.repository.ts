import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Session } from './entities/session.entity';

@Injectable()
export class SessionsRepository {
  constructor(
    private readonly ds: DataSource,
    private repo: Repository<Session> = this.ds.getRepository(Session),
  ) {}

  withManager(manager: EntityManager): SessionsRepository {
    return new SessionsRepository(this.ds, manager.getRepository(Session));
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
