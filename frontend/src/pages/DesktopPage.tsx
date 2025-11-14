import Icn from "@/assets/Icons";
import { Terminal } from "@/components/apps/Terminal/Terminal";
import { openWindow } from "@/components/Window/windowAPI";
import { Window } from "@/components/Window/Window";
import { useState } from "react";

interface WindowState {
  id: number;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  processId: number;
  isMinimized: boolean;
}

const DesktopPage = () => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const openTerminal = async () => {
    try {
      const window = await openWindow({
        title: "Terminal",
        x: 200,
        y: 100,
        width: 700,
        height: 500,
        program: "terminal",
      });

      setWindows((prev) => [
        ...prev,
        {
          id: window.windowId,
          title: window.title,
          x: window.x,
          y: window.y,
          width: window.width,
          height: window.height,
          processId: window.processId,
          isMinimized: false,
        },
      ]);
    } catch (err) {
      console.error("윈도우 생성 실패:", err);
    }
  };

  const closeWindow = () => {
    setWindows([]);
  };

  const minimizeWindow = () => {
    setWindows([{ ...windows[0], isMinimized: true }]);
  };

  const restoreWindow = () => {
    setWindows([{ ...windows[0], isMinimized: false }]);
  };

  const handleShutdown = () => {
    window.location.reload();
  };

  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <div
      className={`flex h-screen w-screen flex-col ${isDarkMode ? "bg-gray-900" : "bg-gray-200"}`}
    >
      {/* 상단 툴바 */}
      <div
        className={`flex h-8 items-center justify-between border-b px-4 text-sm backdrop-blur-sm ${
          isDarkMode
            ? "border-gray-700 bg-gray-800/80 text-white"
            : "border-gray-300 bg-white/80 text-gray-900"
        }`}
      >
        <div className="flex items-center gap-4">
          <span>SimpleOS</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`rounded p-1.5 transition-colors ${
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
            }`}
            title={isDarkMode ? "라이트 모드" : "다크 모드"}
          >
            {isDarkMode ? (
              <Icn.LightMode className="h-4 w-4" />
            ) : (
              <Icn.DarkMode className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={handleRestart}
            className={`rounded p-1.5 transition-colors ${
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
            }`}
            title="재시작"
          >
            <Icn.Restart className="h-4 w-4" />
          </button>
          <button
            onClick={handleShutdown}
            className={`rounded p-1.5 transition-colors ${
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
            }`}
            title="종료"
          >
            <Icn.Power className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 바탕화면 */}
      <div className="flex-1 p-8">
        <button
          className={`flex w-24 flex-col items-center gap-2 rounded-lg p-4 transition-colors ${
            isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-300/50"
          }`}
          onDoubleClick={openTerminal}
        >
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-xl border-2 ${
              isDarkMode
                ? "border-gray-600 bg-gray-800"
                : "border-gray-400 bg-white"
            }`}
          >
            <Icn.Terminal
              className={`h-8 w-8 ${isDarkMode ? "text-white" : "text-gray-900"}`}
            />
          </div>
          <span
            className={`text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}
          >
            Terminal
          </span>
        </button>

        {/* 윈도우 */}
        {windows.length > 0 && !windows[0].isMinimized && (
          <Window
            title="Terminal"
            x={windows[0].x}
            y={windows[0].y}
            width={windows[0].width}
            height={windows[0].height}
            isDarkMode={isDarkMode}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
          >
            <Terminal
              isDarkMode={isDarkMode}
              processId={windows[0].processId}
            />
          </Window>
        )}
      </div>

      {/* 하단 독 */}
      <div className="flex h-16 items-center justify-center pb-2">
        <div
          className={`rounded-2xl border px-4 py-2 shadow-2xl backdrop-blur-md ${
            isDarkMode
              ? "border-gray-700/50 bg-gray-800/60"
              : "border-gray-300/50 bg-white/60"
          }`}
        >
          <div className="flex items-center gap-2">
            {windows.map((window) => (
              <button
                key={window.id}
                className={`relative rounded-lg p-3 transition-colors ${
                  isDarkMode
                    ? "bg-gray-700/50 hover:bg-gray-600/50"
                    : "bg-gray-200/50 hover:bg-gray-300/50"
                }`}
                onClick={restoreWindow}
              >
                <Icn.Terminal
                  className={`h-8 w-8 ${isDarkMode ? "text-white" : "text-gray-900"}`}
                />
                {!window.isMinimized && (
                  <div
                    className={`absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${
                      isDarkMode ? "bg-white" : "bg-gray-900"
                    }`}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopPage;
