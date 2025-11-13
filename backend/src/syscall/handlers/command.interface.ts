// 핸들러가 실행된 후 반환할 결과의 타입
export interface CommandResult {
  stdout: string; // 터미널 표준 출력
  stderr?: string; // 터미널 표준 에러
  cwd?: string;
}

export interface CommandContext {
  processId: number;
}

// 모든 핸들러가 구현할 인터페이스
export interface ICommandHandler {
  // e.g. command: "ls /home" -> args: ["/home"]
  // e.g. command: "help" -> args: []
  // data: 요청에서 들어오는 data 필드
  execute(
    args: string[],
    data?: string,
    context?: CommandContext,
  ): Promise<CommandResult> | CommandResult;
}
