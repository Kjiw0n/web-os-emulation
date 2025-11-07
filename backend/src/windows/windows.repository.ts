import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Window } from './entities/window.entity';

@Injectable()
export class WindowsRepository {
  private repo: Repository<Window>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(Window);
  }

  withManager(manager: EntityManager): WindowsRepository {
    const newRepo = new WindowsRepository(this.dataSource);
    newRepo.repo = manager.getRepository(Window);
    return newRepo;
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

  async save(window: Window): Promise<Window> {
    return this.repo.save(window);
  }

  async findOne(id: number): Promise<Window | null> {
    return this.repo.findOne({ where: { id } });
  }

  async find(): Promise<Window[]> {
    return this.repo.find();
  }
}
