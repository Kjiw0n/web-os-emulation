import clsx from "clsx";
import Bin from "@/assets/Icons/Bin.svg";
import Plus from "@/assets/Icons/Plus.svg";

interface Note {
  id: number;
  title: string;
  content: string;
}

interface NoteListProps {
  notes: Note[];
  selectedNoteId: number | null;
  setSelectedNoteId: (id: number) => void;
  addNote: () => void;
  deleteNote: () => void;
  isDarkMode: boolean;
}

export function NoteList({
  notes,
  selectedNoteId,
  setSelectedNoteId,
  addNote,
  deleteNote,
  isDarkMode,
}: NoteListProps) {

  {/* 메모 선택 handler */}
  const handleSelectNote = (id: number) => {
    setSelectedNoteId(id);
  };

  {/* 메모 item 스타일 클래스 */}
  const getNoteItemClasses = (noteId: number) =>
    clsx(
      "cursor-pointer rounded p-2 mb-1",
      {
        "bg-yellow-500 text-white": selectedNoteId === noteId,
        "hover:bg-gray-700 text-white": selectedNoteId !== noteId && isDarkMode,
        "hover:bg-gray-200": selectedNoteId !== noteId && !isDarkMode,
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
          onClick={addNote}
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
          onClick={deleteNote}
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
        {notes.length > 0 ? (
          notes.map((note) => (
            <div
              key={note.id}
              onClick={() => handleSelectNote(note.id)}
              className={getNoteItemClasses(note.id)}
            >
              {note.title}
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
