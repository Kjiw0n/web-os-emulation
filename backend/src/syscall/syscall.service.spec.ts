import { Test, TestingModule } from '@nestjs/testing';
import { SyscallService } from './syscall.service';

describe('SyscallService', () => {
  let service: SyscallService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SyscallService],
    }).compile();

    service = module.get<SyscallService>(SyscallService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
