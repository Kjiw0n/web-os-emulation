import { Test, TestingModule } from '@nestjs/testing';
import { SyscallService } from './syscall.service';
import { DateHandler } from './handlers/builtins/date.handler';
import { SyscallDto } from './dto/syscall.dto';
import { HelpHandler } from './handlers/builtins/help.handler';
import { UnameHandler } from './handlers/builtins/uname.handler';
import { ClearHandler } from './handlers/builtins/clear.handler';
import * as os from 'os';

describe('SyscallService', () => {
  let service: SyscallService;
  let dateHandler: DateHandler;
  let helpHandler: HelpHandler;
  let clearHandler: ClearHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SyscallService, DateHandler, HelpHandler, ClearHandler],
    }).compile();

    service = module.get<SyscallService>(SyscallService);
    dateHandler = module.get<DateHandler>(DateHandler);
    helpHandler = module.get<HelpHandler>(HelpHandler);
    clearHandler = module.get<ClearHandler>(ClearHandler);
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

  describe('help command', () => {
    it('should return help message', async () => {
      // given
      const dto: SyscallDto = { command: 'help', data: '' };
      const spy = jest.spyOn(helpHandler, 'execute').mockResolvedValue({
        stdout:
          '사용 가능한 명령어:\n- date: 현재 날짜 및 시간 표시\n- help: 명령어 목록 표시\n- uname: OS 이름 및 버전 표시',
        stderr: '',
      });

      // when
      const result = await service.handleCommand(dto);

      // then
      expect(spy).toHaveBeenCalled();
      expect(result.stdout).toContain('사용 가능한 명령어');
      expect(result.stderr).toBe('');
    });
  });
  
  describe('uname command', () => {
    it('should return OS information', async () => {
      // given
      const dto: SyscallDto = { command: 'uname', data: '' };
      const expectedUname = `${os.platform()} ${os.release()} ${os.arch()}`;
      const unameHandler = new UnameHandler();
      const spy = jest
        .spyOn(unameHandler, 'execute')
        .mockResolvedValue({
          stdout: expectedUname,
          stderr: '',
        });

      // when
      const result = await unameHandler.execute([]);

      // then
      expect(spy).toHaveBeenCalled();
      expect(result.stdout).toBe(expectedUname);

  describe('clear command', () => {
    it('should return clear message', async () => {
      // given
      const dto: SyscallDto = { command: 'clear', data: '' };
      const spy = jest.spyOn(clearHandler, 'execute').mockResolvedValue({
        stdout: 'CLEAR',
        stderr: '',
      });

      // when
      const result = await service.handleCommand(dto);

      // then
      expect(spy).toHaveBeenCalled();
      expect(result.stdout).toBe('CLEAR');
      expect(result.stderr).toBe('');
    });
  });
});
