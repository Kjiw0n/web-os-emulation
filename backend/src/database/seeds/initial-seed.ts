import { FileSystem } from 'src/file-system/entities';
import { AppDataSource } from '../data-source';
import { FileType } from 'src/file-system/types';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Data Source initialized');

    const fileSystemRepo = AppDataSource.getRepository(FileSystem);

    // 이미 데이터가 있는지 확인
    const existing = await fileSystemRepo.findOne({ where: { name: 'root' } });
    if (existing) {
      console.log('Seed data already exists. Skipping...');
      await AppDataSource.destroy();
      return;
    }

    // 루트 디렉토리 생성
    const root = fileSystemRepo.create({
      name: 'root',
      type: FileType.DIRECTORY,
      parentId: null,
      size: '0',
      permissions: 'rwx',
    });
    await fileSystemRepo.save(root);
    console.log('Created root directory');

    // /root, /program, /example 생성
    const directories = [
      { name: 'root', path: '/root' },
      { name: 'program', path: '/program' },
      { name: 'example', path: '/example' },
    ];

    for (const dir of directories) {
      const directory = fileSystemRepo.create({
        name: dir.name,
        type: FileType.DIRECTORY,
        parentId: root.id,
        size: '0',
        permissions: 'rwx',
      });
      await fileSystemRepo.save(directory);
      console.log(`Created directory: ${dir.path}`);
    }

    console.log('Seed completed successfully');
    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
