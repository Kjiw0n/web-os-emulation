import clsx from "clsx";

interface Note {
  id: number;
  name: string;
  content: string;
  updatedAt?: string;
}

interface NoteEditorProps {
  note: Note;
  onChange: (content: string) => void;
  isDarkMode: boolean;
}

export function NoteEditor({ note, onChange, isDarkMode }: NoteEditorProps) {
  return (
    <div className="flex flex-col h-full">
      {note.updatedAt && (
        <div
          className={clsx(
            "w-full text-center py-1 text-sm border-b",
            isDarkMode ? "text-gray-400 border-gray-700" : "text-gray-500 border-gray-300"
          )}
        >
          {new Date(note.updatedAt).toLocaleString()}
        </div>
      )}
      <textarea
        className={`flex-1 w-full p-2 outline-none resize-none ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
        value={note.content}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}