import { Test, TestingModule } from '@nestjs/testing';
import { SyscallService } from './syscall.service';
import { DateHandler } from './handlers/builtins/date.handler';
import { SyscallDto } from './dto/syscall.dto';

describe('SyscallService', () => {
  let service: SyscallService;
  let dateHandler: DateHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SyscallService, DateHandler],
    }).compile();

    service = module.get<SyscallService>(SyscallService);
    dateHandler = module.get<DateHandler>(DateHandler);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('date command', () => {
    it('should return current date string', async () => {
      // given
      const dto: SyscallDto = { command: 'date', data: '' };
      const spy = jest
        .spyOn(dateHandler, 'execute')
        .mockResolvedValue({ stdout: 'Thu Nov 6 2025', stderr: '' });

      // when
      const result = await service.handleCommand(dto);

      // then
      expect(spy).toHaveBeenCalled();
      expect(result.stdout).toContain('Thu Nov');
      expect(result.stderr).toBe('');
    });
  });
});
