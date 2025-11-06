import { useState } from "react";

interface WindowProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  isDarkMode: boolean;
}

export function Window({
  title,
  children,
  onClose,
  onMinimize,
  isDarkMode,
}: WindowProps) {
  const [position, setPosition] = useState({ x: 200, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className={`absolute overflow-hidden rounded-xl border shadow-2xl ${
        isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "700px",
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
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
              className="h-3 w-3 rounded-full bg-red-500 transition-colors hover:bg-red-600"
              onClick={onClose}
            />
            <button
              className="h-3 w-3 rounded-full bg-yellow-500 transition-colors hover:bg-yellow-600"
              onClick={onMinimize}
            />
            <button className="h-3 w-3 rounded-full bg-green-500 transition-colors hover:bg-green-600" />
          </div>
        </div>
        <span className="absolute left-1/2 -translate-x-1/2 text-sm">
          {title}
        </span>
        <div className="w-16" />
      </div>

      {/* 콘텐츠 */}
      <div>{children}</div>
    </div>
  );
}
