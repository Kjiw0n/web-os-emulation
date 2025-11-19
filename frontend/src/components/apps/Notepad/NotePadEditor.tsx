interface Memo {
  id: number;
  title: string;
  content: string;
}

interface MemoEditorProps {
  memo: Memo;
  onChange: (content: string) => void;
  isDarkMode: boolean;
}

export function MemoEditor({ memo, onChange, isDarkMode }: MemoEditorProps) {
  return (
    <textarea
      className={`w-full h-full p-2 outline-none resize-none ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
      value={memo.content}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
