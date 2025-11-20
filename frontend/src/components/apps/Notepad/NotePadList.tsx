import clsx from "clsx";
import Bin from "@/assets/Icons/Bin.svg";
import Plus from "@/assets/Icons/Plus.svg";
import type { Note } from "./notes";

interface NoteListProps {
  notes: Note[];
  selectedNoteId: number | null;
  handleSelectNote: (id: number) => void;
  addNote: () => void;
  deleteNote: () => void;
  isDarkMode: boolean;
}

export function NoteList({
  notes,
  selectedNoteId,
  handleSelectNote,
  addNote,
  deleteNote,
  isDarkMode,
}: NoteListProps) {
  {
    /* 메모 item 스타일 클래스 */
  }
  const getNoteItemClasses = (noteId: number) =>
    clsx("cursor-pointer rounded p-2 mb-1", {
      "bg-yellow-500 text-white": selectedNoteId === noteId,
      "hover:bg-gray-700 text-white": selectedNoteId !== noteId && isDarkMode,
      "hover:bg-gray-200": selectedNoteId !== noteId && !isDarkMode,
    });

  return (
    <div
      className={clsx(
        "flex h-full w-1/3 flex-col border-r p-2",
        isDarkMode
          ? "border-gray-700 bg-gray-900"
          : "border-gray-300 bg-gray-100",
      )}
    >
      {/* 버튼 영역 */}
      <div className="mb-2 flex gap-2">
        <button
          onClick={addNote}
          className="flex items-center justify-center rounded p-2"
        >
          <Plus
            className={clsx(
              "h-5 w-5",
              isDarkMode ? "text-gray-200" : "text-gray-900",
            )}
          />
        </button>

        <button
          onClick={deleteNote}
          className="flex items-center justify-center rounded p-2"
        >
          <Bin
            className={clsx(
              "h-5 w-5",
              isDarkMode ? "text-gray-200" : "text-gray-900",
            )}
          />
        </button>
      </div>

      {/* 메모 목록 */}
      <div className="flex-1 overflow-y-auto">
        {notes.length > 0 ? (
          notes.map((note) => (
            <div
              key={note.id}
              onClick={() => handleSelectNote(note.id)}
              className={getNoteItemClasses(note.id)}
            >
              <div className="font-medium">{note.name}</div>
              {note.updatedAt && (
                <div className="text-xs text-gray-400">
                  {new Date(note.updatedAt).toLocaleString()}
                </div>
              )}
            </div>
          ))
        ) : (
          <div
            className={clsx(
              "flex h-full w-full flex-col items-center justify-start px-4 pt-8 text-sm",
              isDarkMode ? "text-gray-500" : "text-gray-600",
            )}
          >
            메모가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
