import Icn from "@/assets/Icons";
import { Terminal } from "@/components/apps/Terminal/Terminal";
import { Notepad } from "@/components/apps/Notepad/Notepad";
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
  program: "terminal" | "notepad";
}

const appMap = {
  terminal: Terminal,
  notepad: Notepad,
};

const appIconMap = {
  terminal: Icn.Terminal,
  notepad: Icn.Notepad,
};

const DesktopPage = () => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const OpenWindow = async (program: "terminal" | "notepad") => {
    try {
      const config = {
        terminal: { title: "Terminal", width: 700, height: 500 },
        notepad: { title: "Notepad", width: 800, height: 600 },
      };

      const { title, width, height } = config[program];

      const windowData = await openWindow({
        title,
        x: 200 + windows.length * 30,
        y: 100 + windows.length * 30,
        width,
        height,
        program,
      });

      setWindows((prev) => [
        ...prev,
        {
          id: windowData.windowId,
          title: windowData.title,
          x: windowData.x,
          y: windowData.y,
          width: windowData.width,
          height: windowData.height,
          processId: windowData.processId,
          isMinimized: false,
          program: program,
        },
      ]);
    } catch (err) {
      console.error(`${program} 실행 실패:`, err);
    }
  };

  // ID 기반으로 특정 윈도우 닫기
  const closeWindow = (id: number) => {
    setWindows((prev) => prev.filter((window) => window.id !== id));
  };

  // ID 기반으로 특정 윈도우 최소화
  const minimizeWindow = (id: number) => {
    setWindows((prev) =>
      prev.map((window) =>
        window.id === id ? { ...window, isMinimized: true } : window,
      ),
    );
  };

  // ID 기반으로 특정 윈도우 복원
  const restoreWindow = (id: number) => {
    setWindows((prev) =>
      prev.map((window) =>
        window.id === id ? { ...window, isMinimized: false } : window,
      ),
    );
  };

  const handleShutdown = () => window.location.reload();
  const handleRestart = () => window.location.reload();

  return (
    <div
      className={`flex h-screen w-screen flex-col ${isDarkMode ? "bg-gray-900" : "bg-gray-200"}`}
    >
      {/* 상단 툴바 */}
      <div
        data-testid="topbar"
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
              <Icn.LightMode className="w-4 h-4" />
            ) : (
              <Icn.DarkMode className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={handleRestart}
            className={`rounded p-1.5 transition-colors ${
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
            }`}
            title="재시작"
          >
            <Icn.Restart className="w-4 h-4" />
          </button>
          <button
            onClick={handleShutdown}
            className={`rounded p-1.5 transition-colors ${
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
            }`}
            title="종료"
          >
            <Icn.Power className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 바탕화면 */}
      <div className="flex-1 p-8">
        {/* 아이콘 */}
        {Object.keys(appMap).map((program) => {
          const AppIcon = appIconMap[program as keyof typeof appIconMap];
          return (
            <button
              key={program}
              className={`flex w-24 flex-col items-center gap-2 rounded-lg p-4 transition-colors ${
                isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-300/50"
              }`}
              onDoubleClick={() => OpenWindow(program as keyof typeof appMap)}
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl border-2 ${
                  isDarkMode
                    ? "border-gray-600 bg-gray-800"
                    : "border-gray-400 bg-white"
                }`}
              >
                <AppIcon
                  className={`h-8 w-8 ${isDarkMode ? "text-white" : "text-gray-900"}`}
                />
              </div>
              <span
                className={`text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                {program}
              </span>
            </button>
          );
        })}
      </div>

      {/* 윈도우 */}
      {windows.map((win) =>
        !win.isMinimized ? (
          <Window
            key={win.id}
            title={win.title}
            x={win.x}
            y={win.y}
            width={win.width}
            height={win.height}
            isDarkMode={isDarkMode}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
          >
            {(() => {
              const AppComponent = appMap[win.program];
              return AppComponent ? (
                <AppComponent
                  isDarkMode={isDarkMode}
                  processId={win.processId}
                />
              ) : null;
            })()}
          </Window>
        ) : null,
      )}

      {/* 하단 독 */}
      <div
        data-testid="dock"
        className="flex justify-center items-center pb-2 h-16"
      >
        <div
          className={`rounded-2xl border px-4 py-2 shadow-2xl backdrop-blur-md ${
            isDarkMode
              ? "border-gray-700/50 bg-gray-800/60"
              : "border-gray-300/50 bg-white/60"
          }`}
        >
          <div className="flex items-center gap-2">
            {windows.map((win) => {
              const AppIcon = appIconMap[win.program];
              return (
                <button
                  key={win.id}
                  className={`relative rounded-lg p-3 transition-colors ${
                    isDarkMode
                      ? "bg-gray-700/50 hover:bg-gray-600/50"
                      : "bg-gray-200/50 hover:bg-gray-300/50"
                  }`}
                  onClick={() => restoreWindow(win.id)}
                >
                  <AppIcon
                    className={`h-8 w-8 ${isDarkMode ? "text-white" : "text-gray-900"}`}
                  />
                  {!win.isMinimized && (
                    <div
                      className={`absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${
                        isDarkMode ? "bg-white" : "bg-gray-900"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopPage;
