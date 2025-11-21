import { useEffect, useState } from "react";
import { NoteList } from "./NotePadList";
import { NoteEditor } from "./NotePadEditor";
import { createNote, getNoteList, deleteNoteApi, type Note } from "./notes";

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

  const selectedNote = notes.find((m) => m.id === selectedNoteId);

  const addNote = async () => {
    try {
      const newNoteData = await createNote({
        name: "새 파일",
      });

      setNotes((prevNotes) => [
        {
          id: newNoteData.id,
          name: newNoteData.name,
          updatedAt: newNoteData.updatedAt,
        },
        ...prevNotes,
      ]);

      const updatedNotes = await getNoteList();
      setNotes(updatedNotes);

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
