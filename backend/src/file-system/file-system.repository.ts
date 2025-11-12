import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, IsNull, Repository } from 'typeorm';
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

  async findById(id: number): Promise<FileSystem | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByDirName(name: string): Promise<FileSystem | null> {
    return this.repo.findOne({ where: { name } });
  }

  async getRootDirectory(): Promise<FileSystem | null> {
    return this.repo.findOne({ where: { parentId: IsNull() } });
  }

  /**
   * 특정 부모 디렉토리 내에서 이름이 일치하는 자식 노드(파일 또는 디렉토리) 하나를 조회합니다.
   *
   * @param parentId - 상위 폴더 ID
   * @param name - 찾고자 하는 자식 노드의 이름
   * @returns {Promise<FileSystem | null>} - 노드를 찾으면 FileSystem 객체를, 찾지 못하면 null을 반환하는 Promise
   */
  async findChildByName(
    parentId: number,
    name: string,
  ): Promise<FileSystem | null> {
    return this.repo.findOne({
      where: {
        parentId: parentId,
        name: name,
      },
    });
  }

  /**
   * 특정 부모 디렉토리 ID에 속한 모든 직계 자식 노드(파일 및 디렉토리) 목록을 조회합니다.
   *
   * @param parentId - 상위 폴더 ID
   * @returns {Promise<FileSystem[]>} - 자식 노드(FileSystem 객체)의 배열을 반환하는 Promise. 자식이 없으면 빈 배열을 반환합니다.
   */
  async findChildrenByParentId(parentId: number): Promise<FileSystem[]> {
    return this.repo.find({
      where: { parentId: parentId },
      order: {
        type: 'DESC',
        name: 'ASC',
      },
    });
  }

  async save(fileSystem: FileSystem): Promise<FileSystem> {
    return this.repo.save(fileSystem);
  }
}
