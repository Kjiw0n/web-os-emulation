import { FileSystemRepository } from 'src/file-system/file-system.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FileSystem } from './entities/file-system.entity';
import { FileType } from './types';
import { S3Service } from 'src/s3/s3.service';
import { ProcessesRepository } from 'src/processes/processes.repository';

@Injectable()
export class FileSystemService {
  constructor(
    private readonly fileSystemRepository: FileSystemRepository,
    private readonly s3Service: S3Service,
    private readonly processesRepo: ProcessesRepository,

  ) {}

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
   * write 명령어 로직
   * 절대 경로를 기반으로 파일 생성
   * @param path - 디렉토리 절대 경로 (예: "/home/usr")
   * @param fileName - 파일 이름 (예: "hello.txt")
   * @param content - 파일 내용
   */
  async writeFile(path: string, fileName: string, content: string) {
    const parentDir = await this.findNodeByAbsolutePath(path);

    if (parentDir.type !== FileType.DIRECTORY) {
      throw new Error(`'${path}'는 디렉토리가 아닙니다.`);
    }

    // S3에 파일 업로드
    const contentUrl = await this.s3Service.uploadFile(content, fileName);

    // 파일 엔티티 생성
    const newFile = new FileSystem();
    newFile.name = fileName;
    newFile.type = FileType.FILE;
    newFile.parentId = parentDir.id;
    newFile.contentUrl = contentUrl;
    newFile.size = content.length.toString();
    newFile.fileExtension = fileName.split('.').pop() || null;
    newFile.permissions = 'rw-';

    // 파일 엔티티 저장
    return await this.fileSystemRepository.save(newFile);
  }

  /**
   * 파일 내용을 가져옵니다.
   * @param processId - 현재 프로세스 ID
   * @param targetPath - 파일 절대 또는 상대 경로
   * @returns 파일 내용 문자열
   * @throws {Error} - 파일을 찾지 못했거나 디렉토리인 경우
   */
  async readFile(processId: number, targetPath: string): Promise<string> {
    let fileNode: FileSystem;

    if (targetPath.startsWith('/')) {
      // 절대 경로
      fileNode = await this.findNodeByAbsolutePath(targetPath);
    } else {
      // 상대 경로
      const proc = await this.processesRepo.findOne(processId);
      if (!proc) throw new Error(`프로세스 ID ${processId}를 찾을 수 없습니다.`);

      const segments = targetPath.split('/').filter(Boolean);
      const fileName = segments.pop()!;
      const relativeDir = segments.join('/');
      const targetDirId = await this.resolveRelativePath(
        proc.currentDirectoryId,
        relativeDir || '.'
      );
      const directoryPath = await this.buildPath(targetDirId);
      fileNode = await this.findNodeByAbsolutePath(`${directoryPath}/${fileName}`);
    }

    if (!fileNode) throw new Error(`'${targetPath}'를 찾을 수 없습니다.`);
    if (fileNode.type !== FileType.FILE) throw new Error(`'${fileNode.name}'는 파일이 아닙니다.`);

    if (!fileNode.contentUrl) throw new Error(`'${fileNode.name}'에 내용이 없습니다.`);

    // S3에서 다운로드
    // contentUrl은 "https://{bucket}.kr.object.ncloudstorage.com/{key}" 형식이므로 key만 추출
    const url = new URL(fileNode.contentUrl);
    const key = url.pathname.slice(1); // 앞의 '/' 제거

    return this.s3Service.downloadFile(key);
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

  /**
   * 현재 디렉토리 기준으로 상대 경로를 해석하여 최종 디렉토리 ID를 반환.
   * @param currentDirectoryId - 현재 작업 디렉토리 ID
   * @param relativePath - 상대 경로 (예: "documents", "..", "documents/notes")
   * @returns - 최종 디렉토리 ID
   * @throws {Error} - 경로가 존재하지 않거나 디렉토리가 아닌 경우
   */
  async resolveRelativePath(
    currentDirectoryId: number,
    relativePath: string,
  ): Promise<number> {
    // 빈 경로는 현재 디렉토리
    if (!relativePath || relativePath === '.') {
      return currentDirectoryId;
    }

    // 경로를 '/' 기준으로 분리. 공백은 fileter로 처리
    const segments = relativePath.split('/').filter((seg) => seg);

    let currentId = currentDirectoryId;

    for (const segment of segments) {
      if (segment === '.') {
        // 현재 디렉토리 - 아무것도 안 함
        continue;
      } else if (segment === '..') {
        // 부모 디렉토리로 이동
        const current = await this.fileSystemRepository.findById(currentId);
        if (!current) {
          throw new Error('디렉토리를 찾을 수 없습니다.');
        }
        if (current.parentId === null) {
          throw new Error('루트 디렉토리의 상위로 이동할 수 없습니다.');
        }
        currentId = current.parentId;
      } else {
        // 자식 디렉토리 찾기
        const child = await this.fileSystemRepository.findChildByName(
          currentId,
          segment,
        );

        // TODO: DDD에 맞게 파일의 검증 로직은 fs entity에서 처리
        if (!child) {
          throw new NotFoundException(`'${segment}'를 찾을 수 없습니다.`);
        }

        if (child.type !== FileType.DIRECTORY) {
          throw new Error(`'${segment}'는 디렉토리가 아닙니다.`);
        }

        currentId = child.id;
      }
    }

    return currentId;
  }
}
