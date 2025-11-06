import { Test, TestingModule } from '@nestjs/testing';
import { SyscallController } from './syscall.controller';

describe('SyscallController', () => {
  let controller: SyscallController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SyscallController],
    }).compile();

    controller = module.get<SyscallController>(SyscallController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
