import { useState } from "react";
import { MemoList } from "./NotePadList";
import { MemoEditor } from "./NotePadEditor";

interface Memo {
  id: number;
  title: string;
  content: string;
}

interface NotepadProps {
  isDarkMode: boolean;
  processId: number; 
}

export function Notepad({ isDarkMode, processId }: NotepadProps) {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [selectedMemoId, setSelectedMemoId] = useState<number | null>(null);

  const selectedMemo = memos.find((m) => m.id === selectedMemoId);

  const addMemo = () => {
    const newMemo: Memo = {
      id: Date.now(),
      title: "새 파일",
      content: "",
    };

    setMemos([newMemo, ...memos]);
    setSelectedMemoId(newMemo.id);
  };

  const deleteMemo = () => {
    if (!selectedMemoId) return;

    setMemos(memos.filter((m) => m.id !== selectedMemoId));
    setSelectedMemoId(null);
  };

  const updateMemoContent = (content: string) => {
    setMemos(
      memos.map((m) =>
        m.id === selectedMemoId ? { ...m, content } : m
      )
    );
  };

  return (
    <div className="flex h-full">
      {/* LeftPane: MemoList */}
      <MemoList
        memos={memos}
        selectedMemoId={selectedMemoId}
        setSelectedMemoId={setSelectedMemoId}
        addMemo={addMemo}
        deleteMemo={deleteMemo}
        isDarkMode={isDarkMode}
      />

      {/* RightPane: Editor */}
      <div className={`flex-1 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        {selectedMemo ? (
          <MemoEditor
            memo={selectedMemo}
            onChange={updateMemoContent}
            isDarkMode={isDarkMode}
          />
        ) : (
          <div
            className={`h-full w-full flex flex-col items-center justify-start pt-8 px-4 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            메모를 선택하거나 새 메모를 작성하세요.
          </div>
        )}
      </div>
    </div>
  );
}
