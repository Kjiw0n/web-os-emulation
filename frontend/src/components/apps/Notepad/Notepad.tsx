import { useCallback, useEffect, useState } from "react";
import { NoteList } from "./NotePadList";
import { NoteEditor } from "./NotePadEditor";
import { createNote, getNoteList, deleteNoteApi, type Note } from "./notes";
import { useNoteListSync } from "./hooks/useNoteListSync";

interface NotepadProps {
  isDarkMode: boolean;
  processId: number;
}

export function Notepad({ isDarkMode }: NotepadProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);

  useEffect(() => {
    async function loadNotes() {
      try {
        const data = await getNoteList();
        setNotes(data);
      } catch (error) {
        console.error("노트 목록 로딩 실패:", error);
      }
    }
    loadNotes();
  }, []);

  // 웹소켓 이벤트 핸들러 (다른 창에서 생성/삭제 시 호출됨)
  const handleRemoteNoteCreated = useCallback((newNote: Note) => {
    setNotes((prev) => {
      if (prev.some((n) => n.id === newNote.id)) return prev; // 중복 방지
      return [newNote, ...prev];
    });
  }, []);

  const handleRemoteNoteDeleted = useCallback((deletedId: number) => {
    setNotes((prev) => prev.filter((n) => n.id !== deletedId));
    setSelectedNoteId((curr) => (curr === deletedId ? null : curr));
  }, []);

  useNoteListSync({
    onNoteCreated: handleRemoteNoteCreated,
    onNoteDeleted: handleRemoteNoteDeleted,
  });

  const selectedNote = notes.find((m) => m.id === selectedNoteId);

  const addNote = async () => {
    try {
      const newNoteData = await createNote({ name: "새 파일" });
      // setNotes는 handleRemoteNoteCreated에서 실행
      setSelectedNoteId(newNoteData.id);
    } catch (error) {
      console.error("메모 생성 실패:", error);
    }
  };

  const deleteNote = async () => {
    if (selectedNoteId == null) return;

    try {
      await deleteNoteApi(selectedNoteId);

      setNotes((prevNotes) => prevNotes.filter((m) => m.id !== selectedNoteId));
      setSelectedNoteId(null);
    } catch (err) {
      console.error("삭제 실패", err);
    }
  };

  const handleSelectNote = (id: number) => setSelectedNoteId(id);

  return (
    <div className="flex h-full">
      {/* LeftPane: NoteList */}
      <NoteList
        notes={notes}
        selectedNoteId={selectedNoteId}
        handleSelectNote={handleSelectNote}
        addNote={addNote}
        deleteNote={deleteNote}
        isDarkMode={isDarkMode}
      />

      {/* RightPane: Editor */}
      <div className={`flex-1 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        {selectedNote ? (
          <NoteEditor
            key={selectedNoteId}
            fileId={selectedNoteId!!}
            updatedAt={selectedNote.updatedAt}
            isDarkMode={isDarkMode}
          />
        ) : (
          <div
            className={`flex h-full w-full flex-col items-center justify-start px-4 pt-8 ${
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
