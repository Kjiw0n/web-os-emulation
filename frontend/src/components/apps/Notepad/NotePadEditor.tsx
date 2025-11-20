import { useRef } from "react";
import { useYjs } from "./useYjs";

interface NoteEditorProps {
  fileId: number;
  isDarkMode: boolean;
}

export function NoteEditor({ fileId, isDarkMode }: NoteEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { handleInput } = useYjs(fileId, textareaRef);

  return (
    <textarea
      ref={textareaRef}
      onInput={handleInput}
      className={`h-full w-full resize-none p-2 outline-none ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
      spellCheck={false}
    />
  );
}
