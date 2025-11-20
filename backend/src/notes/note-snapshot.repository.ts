import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { NoteSnapshot } from './entities';

@Injectable()
export class NoteSnapshotRepository {
  private repo: Repository<NoteSnapshot>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(NoteSnapshot);
  }

  async save(snapshot: NoteSnapshot): Promise<NoteSnapshot> {
    return this.repo.save(snapshot);
  }

  async findLatestByFileId(fileId: number): Promise<NoteSnapshot | null> {
    return this.repo.findOne({
      where: { fileId },
      order: { version: 'DESC' },
    });
  }

  async findByFileIdAndVersion(
    fileId: number,
    version: number,
  ): Promise<NoteSnapshot | null> {
    return this.repo.findOne({
      where: { fileId, version },
    });
  }

  create(data: Partial<NoteSnapshot>): NoteSnapshot {
    return this.repo.create(data);
  }
}
