import { useState, useRef, useEffect } from "react";
import { requestSyscall } from "./syscall";

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

  const handleCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const newOutput = [...output, `$ ${cmd}`];
    setInput("");

    try {
      const res = await requestSyscall({ command: trimmed });
      const stdout = res.stdout.trim();

      if (stdout === "CLEAR") {
        setOutput([]);
        return;
      }

      setOutput([...newOutput, stdout, ""]);
    } catch (error) {
      console.error(error);
      setOutput([
        ...newOutput,
        "Error: Failed to execute command. Please try again.",
        "",
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    console.log(import.meta.env.VITE_API_BASE_URL);

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
