import { Provider } from '@nestjs/common';
import { FileSystemRepository } from '../../file-system/file-system.repository';

export const NotesDirIdProvider: Provider = {
  provide: 'NOTES_DIR_ID',
  useFactory: async (fileSystemRepository: FileSystemRepository) => {
    const notesDir = await fileSystemRepository.findByDirName('notes');
    if (!notesDir) {
      throw new Error('Notes directory not found in file system');
    }
    return notesDir.id;
  },
  inject: [FileSystemRepository],
};
