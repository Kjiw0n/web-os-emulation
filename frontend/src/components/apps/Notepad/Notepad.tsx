import { useEffect, useState } from "react";
import { NoteList } from "./NotePadList";
import { NoteEditor } from "./NotePadEditor";
import { createNote, getNoteList, getNote } from "./notes";

interface Note {
  id: number;
  name: string;
  content: string;
  updatedAt?: string;
}

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
        setNotes(data.map(n => ({ ...n, content: "", updated_at: n.updatedAt })));
      } catch (error) {
        console.error("노트 목록 로딩 실패:", error);
      }
    }
    loadNotes();
  }, []);

  const selectedNote = notes.find((m) => m.id === selectedNoteId);

  const handleSelectNote = async (id: number) => {
    setSelectedNoteId(id);
    const note = notes.find((n) => n.id === id);
    if (note && !note.content) {
      try {
        const data = await getNote(id);
        setNotes(notes.map((m) => (m.id === id ? { ...m, content: data.content } : m)));
      } catch (error) {
        console.error("노트 내용 로딩 실패:", error);
      }
    }
  };

  const addNote = async () => {
    try {
      const newNoteData = await createNote({
        name: "새 파일",
        content: "",
      });

      setNotes([{
        id: newNoteData.id,      
        name: newNoteData.name,
        content: "",
        updatedAt: newNoteData.updatedAt
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
        setSelectedNoteId={handleSelectNote}
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
