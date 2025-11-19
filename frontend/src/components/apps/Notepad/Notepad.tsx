import { useState } from "react";
import { NoteList } from "./NotePadList";
import { NoteEditor } from "./NotePadEditor";
import { createNote } from "./notes";

interface Note {
  id: number;
  title: string;
  content: string;
}

interface NotepadProps {
  isDarkMode: boolean;
  processId: number; 
}

export function Notepad({ isDarkMode, processId }: NotepadProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);

  const selectedNote = notes.find((m) => m.id === selectedNoteId);

  const addNote = async () => {
    try {
      const newNoteData = await createNote({
        title: "새 파일",
        content: "",
      });

      setNotes([{
        id: newNoteData.id,      
        title: newNoteData.title,
        content: "",          
      }, ...notes]);

      setSelectedNoteId(newNoteData.id);
    } catch (error) {
      console.error("메모 생성 실패:", error);
    }
  };

  const deleteNote = () => {
    if (!selectedNoteId) return;

    setNotes(notes.filter((m) => m.id !== selectedNoteId));
    setSelectedNoteId(null);
  };

  const updateNoteContent = (content: string) => {
    setNotes(
      notes.map((m) =>
        m.id === selectedNoteId ? { ...m, content } : m
      )
    );
  };

  return (
    <div className="flex h-full">
      {/* LeftPane: NoteList */}
      <NoteList
        notes={notes}
        selectedNoteId={selectedNoteId}
        setSelectedNoteId={setSelectedNoteId}
        addNote={addNote}
        deleteNote={deleteNote}
        isDarkMode={isDarkMode}
      />

      {/* RightPane: Editor */}
      <div className={`flex-1 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        {selectedNote ? (
          <NoteEditor
            note={selectedNote}
            onChange={updateNoteContent}
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
