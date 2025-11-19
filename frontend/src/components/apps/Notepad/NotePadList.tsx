import clsx from "clsx";
import Bin from "@/assets/Icons/Bin.svg";
import Plus from "@/assets/Icons/Plus.svg";

interface Memo {
  id: number;
  title: string;
  content: string;
}

interface MemoListProps {
  memos: Memo[];
  selectedMemoId: number | null;
  setSelectedMemoId: (id: number) => void;
  addMemo: () => void;
  deleteMemo: () => void;
  isDarkMode: boolean;
}

export function MemoList({
  memos,
  selectedMemoId,
  setSelectedMemoId,
  addMemo,
  deleteMemo,
  isDarkMode,
}: MemoListProps) {

  const getMemoItemClasses = (memoId: number) =>
    clsx(
      "cursor-pointer rounded p-2 mb-1",
      {
        "bg-yellow-500 text-white": selectedMemoId === memoId,
        "hover:bg-gray-700 text-white": selectedMemoId !== memoId && isDarkMode,
        "hover:bg-gray-200": selectedMemoId !== memoId && !isDarkMode,
      }
    );

  return (
    <div
      className={clsx(
        "w-1/3 h-full border-r flex flex-col p-2",
        isDarkMode
          ? "border-gray-700 bg-gray-900"
          : "border-gray-300 bg-gray-100"
      )}
    >
      {/* 버튼 영역 */}
      <div className="flex gap-2 mb-2">
        <button
          onClick={addMemo}
          className="flex items-center justify-center p-2 rounded"
        >
          <Plus
            className={clsx(
              "w-5 h-5",
              isDarkMode ? "text-gray-200" : "text-gray-900"
            )}
          />
        </button>

        <button
          onClick={deleteMemo}
          className="flex items-center justify-center p-2 rounded"
        >
          <Bin
            className={clsx(
              "w-5 h-5",
              isDarkMode ? "text-gray-200" : "text-gray-900"
            )}
          />
        </button>
      </div>

      {/* 메모 목록 */}
      <div className="flex-1 overflow-y-auto">
        {memos.length > 0 ? (
          memos.map((memo) => (
            <div
              key={memo.id}
              onClick={() => setSelectedMemoId(memo.id)}
              className={getMemoItemClasses(memo.id)}
            >
              {memo.title}
            </div>
          ))
        ) : (
          <div
            className={clsx(
              "h-full w-full flex flex-col items-center justify-start pt-8 px-4 text-sm",
              isDarkMode ? "text-gray-500" : "text-gray-600"
            )}
          >
            메모가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
