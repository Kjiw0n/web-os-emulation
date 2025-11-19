interface Note {
  id: number;
  title: string;
  content: string;
}

interface NoteEditorProps {
  note: Note;
  onChange: (content: string) => void;
  isDarkMode: boolean;
}

export function NoteEditor({ note, onChange, isDarkMode }: NoteEditorProps) {
  return (
    <textarea
      className={`w-full h-full p-2 outline-none resize-none ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
      value={note.content}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
