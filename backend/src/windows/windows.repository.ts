import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Window } from './entities/window.entity';

@Injectable()
export class WindowsRepository {
  constructor(
    private readonly ds: DataSource,
    private repo: Repository<Window> = this.ds.getRepository(Window),
  ) {}

  withManager(manager: EntityManager): WindowsRepository {
    return new WindowsRepository(this.ds, manager.getRepository(Window));
  }

  // FIXME: 최상단(z_index DESC) 윈도우를 FOR UPDATE로 가져오기. 다른 방법 있을까?
  async getTopWindowForUpdate(): Promise<Window | null> {
    return this.repo
      .createQueryBuilder('w')
      .orderBy('w.z_index', 'DESC')
      .limit(1)
      .setLock('pessimistic_write') // FOR UPDATE
      .getOne();
  }

  create(data: Partial<Window>): Window {
    return this.repo.create(data);
  }

  save(entity: Window): Promise<Window> {
    return this.repo.save(entity);
  }
}
