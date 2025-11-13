import { Test, TestingModule } from '@nestjs/testing';
import { SyscallController } from './syscall.controller';
import { SyscallService } from './syscall.service';
import { DateHandler } from './handlers/builtins/date.handler';
import { HelpHandler } from './handlers/builtins/help.handler';
import { ClearHandler } from './handlers/builtins/clear.handler';

describe('SyscallController', () => {
  let controller: SyscallController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SyscallController],
      providers: [SyscallService, DateHandler, HelpHandler, ClearHandler],
    }).compile();

    controller = module.get<SyscallController>(SyscallController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
