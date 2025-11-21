import { useEffect } from "react";
import type { Note } from "../notes";

interface UseNoteListSyncProps {
  onNoteCreated: (note: Note) => void;
  onNoteDeleted: (noteId: number) => void;
}

export function useNoteListSync({
  onNoteCreated,
  onNoteDeleted,
}: UseNoteListSyncProps) {
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000/yjs?mode=list");

    ws.onopen = () => {
      console.log("[NoteList] 로비에 연결되었습니다.");
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        // Gateway에서 보낸 type 확인
        if (message.type === "note-list-update") {
          if (message.event === "create") {
            onNoteCreated(message.data);
          } else if (message.event === "delete") {
            console.log("onNoteDeleted", message.data.id);
            onNoteDeleted(message.data.id);
          }
        }
      } catch (error) {
        console.error("[NoteList] 메시지 파싱 에러:", error);
      }
    };

    return () => {
      ws.close();
    };
  }, [onNoteCreated, onNoteDeleted]);
}
