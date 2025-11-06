import { useState, useRef, useEffect } from "react";

interface TerminalProps {
  isDarkMode: boolean;
}

export function Terminal({ isDarkMode }: TerminalProps) {
  const [output, setOutput] = useState<string[]>([
    "SimpleOS Terminal v1.0",
    "Type 'help' for available commands",
    "",
  ]);
  const [input, setInput] = useState("");
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const handleCommand = (cmd: string) => {
    // syscall/ API 연결 시 밑에 내용 삭제 예정
    const trimmed = cmd.trim().toLowerCase();
    const newOutput = [...output, `$ ${cmd}`];

    if (trimmed === "help") {
      newOutput.push("Available commands:");
      newOutput.push("  help - Show this help message");
      newOutput.push("  clear - Clear the terminal");
      newOutput.push("  date - Show current date and time");
      newOutput.push("  echo [text] - Echo the text");
    } else if (trimmed === "clear") {
      setOutput([]);
      setInput("");
      return;
    } else if (trimmed === "date") {
      newOutput.push(new Date().toString());
    } else if (trimmed.startsWith("echo ")) {
      newOutput.push(cmd.substring(5));
    } else if (trimmed === "") {
      newOutput.push("");
    } else {
      newOutput.push(`Command not found: ${cmd}`);
    }

    newOutput.push("");
    setOutput(newOutput);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(input);
    }
  };

  return (
    <div
      className={`flex h-96 flex-col p-4 font-mono ${
        isDarkMode ? "bg-gray-900 text-green-400" : "bg-gray-50 text-blue-600"
      }`}
    >
      {/* 출력창 */}
      <div ref={outputRef} className="mb-2 flex-1 overflow-auto">
        {output.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>

      {/* 입력창 */}
      <div className="flex items-center gap-2">
        <span>$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`flex-1 bg-transparent outline-none ${
            isDarkMode ? "text-green-400" : "text-blue-600"
          }`}
          autoFocus
        />
      </div>
    </div>
  );
}
