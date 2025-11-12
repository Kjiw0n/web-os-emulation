import { FileSystemRepository } from 'src/file-system/file-system.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFileSystemDto } from './dto/create-file-system.dto';
import { UpdateFileSystemDto } from './dto/update-file-system.dto';
import { FileSystem } from './entities/file-system.entity';
import { FileType } from './types';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class FileSystemService {
  constructor(
    private readonly fileSystemRepository: FileSystemRepository,
    private readonly s3Service: S3Service,
  ) {}

  create(createFileSystemDto: CreateFileSystemDto) {
    return 'This action adds a new fileSystem';
  }

  findAll() {
    return `This action returns all fileSystem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fileSystem`;
  }

  update(id: number, updateFileSystemDto: UpdateFileSystemDto) {
    return `This action updates a #${id} fileSystem`;
  }

  remove(id: number) {
    return `This action removes a #${id} fileSystem`;
  }

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
}
