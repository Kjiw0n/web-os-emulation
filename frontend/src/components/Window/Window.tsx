import { useState, useEffect, useRef } from "react";

interface WindowProps {
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  children: React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  isDarkMode: boolean;
}

export function Window({
  title,
  x,
  y,
  width,
  height,
  children,
  onClose,
  onMinimize,
  isDarkMode,
}: WindowProps) {
  const [position, setPosition] = useState({ x, y });
  const [isDragging, setIsDragging] = useState(false);
  const dragStateRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStateRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // 부모 컨테이너 (DesktopPage)의 실제 높이 계산
      const topBar = document.querySelector("[data-testid='topbar']");
      const dock = document.querySelector("[data-testid='dock']");

      const TOOLBAR_HEIGHT = topBar!.clientHeight;
      const DOCK_HEIGHT = dock!.clientHeight;

      let newX = e.clientX - dragStateRef.current.x;
      let newY = e.clientY - dragStateRef.current.y;

      // 좌측 경계 제약
      newX = Math.max(0, newX);

      // 우측 경계 제약
      newX = Math.min(newX, window.innerWidth - width);

      // 상단 경계 제약 (툴바 아래)
      newY = Math.max(TOOLBAR_HEIGHT, newY);

      // 하단 경계 제약 (독 위쪽)
      newY = Math.min(newY, window.innerHeight - DOCK_HEIGHT - height);

      setPosition({
        x: newX,
        y: newY,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, width, height]);

  return (
    <div
      className={`absolute overflow-hidden rounded-xl border shadow-2xl ${
        isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {/* 타이틀바 */}
      <div
        className={`flex cursor-move items-center justify-between border-b px-4 py-3 ${
          isDarkMode
            ? "border-gray-700 bg-gray-800 text-white"
            : "border-gray-300 bg-gray-100 text-gray-900"
        }`}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              className="bg-red-500 hover:bg-red-600 rounded-full w-3 h-3 transition-colors"
              onClick={onClose}
            />
            <button
              className="bg-yellow-500 hover:bg-yellow-600 rounded-full w-3 h-3 transition-colors"
              onClick={onMinimize}
            />
            <button className="bg-green-500 hover:bg-green-600 rounded-full w-3 h-3 transition-colors" />
          </div>
        </div>
        <span className="left-1/2 absolute text-sm -translate-x-1/2">
          {title}
        </span>
        <div className="w-16" />
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 h-full overflow-hidden">{children}</div>
    </div>
  );
}
