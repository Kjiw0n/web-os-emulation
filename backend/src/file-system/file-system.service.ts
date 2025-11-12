import { FileSystemRepository } from 'src/file-system/file-system.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FileSystem } from './entities/file-system.entity';
import { FileType } from './types';

@Injectable()
export class FileSystemService {
  constructor(private readonly fileSystemRepository: FileSystemRepository) {}

  /**
   * 절대 경로 문자열을 기반으로 FileSystem 엔티티를 찾습니다.
   * @param path - 절대 경로
   * @returns - 최종적으로 찾은 FileSystem 노드 객체
   * @throws {Error} - 절대 경로가 아닐 경우, 레포지토리에 루트 디렉토리가 없는 경우,
   *         노드를 찾지 못한 경우 에러 전달
   */
  async findNodeByAbsolutePath(path: string) {
    if (!path.startsWith('/')) {
      throw new Error(`'${path}'는 절대 경로가 아닙니다.`);
    }

    // 루트 디렉토리부터 탐색 시작
    const root = await this.fileSystemRepository.getRootDirectory();
    if (!root) {
      throw new Error('파일 시스템에 루트 디렉토리가 없습니다.');
    }

    if (path === '/') return root;

    let currentDirectory = root;
    // 경로를 '/' 기준으로 분리 (e.g. '/home/usr' -> ['home', 'usr'])
    const segments = path.split('/').filter((segment) => segment.length > 0);

    for (const segment of segments) {
      const nextNode = await this.fileSystemRepository.findChildByName(
        currentDirectory.id,
        segment,
      );
      // 경로 중간에 노드를 찾지 못함
      if (!nextNode) {
        throw new NotFoundException(`'${path}' 경로를 찾을 수 없습니다.`);
      }
      currentDirectory = nextNode;
    }

    return currentDirectory;
  }

  /**
   * ls 명령어 로직
   * @param path - 절대 경로
   */
  async listDirectory(path: string): Promise<FileSystem[]> {
    const targetNode = await this.findNodeByAbsolutePath(path);

    if (targetNode.type !== FileType.DIRECTORY) {
      throw new Error(`'${path}'는 디렉토리가 아닙니다.`);
    }

    // 자식 노드 목록을 조회하여 반환
    return this.fileSystemRepository.findChildrenByParentId(targetNode.id);
  }

  /**
   * 디렉토리 ID로부터 루트까지의 절대 경로를 구성
   * @param directoryId - 경로를 구할 디렉토리 ID
   * @returns - 절대 경로 문자열 (예: "/root/documents")
   * @throws {Error} - 경로 구성 중 노드를 찾지 못한 경우
   */
  async buildPath(directoryId: number): Promise<string> {
    const parts: string[] = [];
    let currentId: number | null = directoryId;

    while (currentId !== null) {
      const directory = await this.fileSystemRepository.findById(currentId);

      if (!directory) {
        throw new Error('경로 구성 중 디렉토리를 찾을 수 없습니다.');
      }

      // 루트가 아니면 이름 추가
      if (directory.parentId !== null) {
        parts.push(directory.name);
      }

      currentId = directory.parentId;
    }

    // 루트는 항상 '/'
    return '/' + parts.reverse().join('/');
  }
}
