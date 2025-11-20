import { useRef } from "react";
import { useYjs } from "./useYjs";
import clsx from "clsx";

interface NoteEditorProps {
  fileId: number;
  updatedAt?: string;
  isDarkMode: boolean;
}

export function NoteEditor({ fileId, updatedAt, isDarkMode }: NoteEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { handleInput } = useYjs(fileId, textareaRef);

  return (
    <div className="flex h-full flex-col">
      {updatedAt && (
        <div
          className={clsx(
            "w-full border-b py-1 text-center text-sm",
            isDarkMode
              ? "border-gray-700 text-gray-400"
              : "border-gray-300 text-gray-500",
          )}
        >
          {new Date(updatedAt).toLocaleString()}
        </div>
      )}
      <textarea
        ref={textareaRef}
        onInput={handleInput}
        className={`h-full w-full resize-none p-2 outline-none ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
        spellCheck={false}
      />
    </div>
  );
}
