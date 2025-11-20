import { useEffect, useRef } from "react";
import * as Y from "yjs";
import diff from "fast-diff";

/**
 * Yjs와 WebSocket을 연동하여 실시간 텍스트 동기화를 처리하는 Custom Hook
 *
 * @description
 * React State를 사용하지 않고 DOM(Textarea)을 직접 조작합니다.
 * 이를 통해 잦은 리렌더링을 방지하고 입력 성능을 최적화합니다.
 *
 * @param fileId - 동기화할 파일(문서)의 고유 ID
 * @param textareaRef - 제어할 HTMLTextAreaElement의 Ref 객체
 * @returns {Object} handleInput - Textarea의 onInput 이벤트에 연결할 핸들러 함수
 */
export function useYjs(
  fileId: number,
  textareaRef: React.RefObject<HTMLTextAreaElement | null>,
) {
  const ydocRef = useRef<Y.Doc | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const doc = new Y.Doc();
    ydocRef.current = doc;
    const yText = doc.getText("content");

    const ws = new WebSocket(`ws://localhost:3000/yjs?fileId=${fileId}`);
    wsRef.current = ws;

    ws.onopen = () => console.log(`[Yjs] Connected to file ${fileId}`);

    /**
     * WebSocket 메시지 수신 핸들러
     * 서버로부터 'sync' 또는 'update' 메시지를 받아 로컬 Yjs 문서에 적용합니다.
     */
    ws.onmessage = async (event) => {
      let data = event.data;
      if (data instanceof Blob) {
        data = await data.text();
      }

      try {
        const message = JSON.parse(data);
        const { type, data: content } = message;

        if (type === "sync" || type === "update") {
          const update = fromBase64(content);

          // 'remote' origin을 지정하여 무한 루프(Echo) 방지
          Y.applyUpdate(doc, update, "remote");

          // [초기화] Sync 단계에서는 Textarea에 값을 강제로 주입
          if (type === "sync" && textareaRef.current) {
            textareaRef.current.value = yText.toString();
          }
        }
      } catch (e) {
        console.error("[Yjs] Message parsing error:", e);
      }
    };

    /**
     * Yjs 변경 감지 옵저버 (Observer)
     *
     * 원격(Remote)에서 변경사항이 발생했을 때만 실행되며,
     * React State를 거치지 않고 DOM(.value)을 직접 수정하여 렌더링을 최적화합니다.
     */
    yText.observe((event, transaction) => {
      // 로컬(내가 입력한) 변경사항은 이미 화면에 반영되어 있으므로 무시
      if (transaction.origin === "local") return;

      const textarea = textareaRef.current;
      if (!textarea) return;

      /**
       * [커서 위치 보정]
       * 전체 값을 교체(value = ...)하면 커서가 맨 뒤로 이동하는 현상이 발생하므로,
       * 현재 위치를 기억했다가 복구합니다.
       * (더 정교한 커서 동기화는 Yjs Binding 라이브러리 필요)
       */
      const currentCursor = textarea.selectionStart;
      textarea.value = yText.toString();
      textarea.setSelectionRange(currentCursor, currentCursor);
    });

    /**
     * 로컬 업데이트 전송 핸들러
     * 내가 발생시킨('local') 변경사항만 서버로 전송합니다.
     */
    doc.on("update", (update: Uint8Array, origin: any) => {
      if (origin !== "remote" && ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            event: "message",
            data: { type: "update", content: toBase64(update) },
          }),
        );
      }
    });

    // Cleanup
    return () => {
      ws.close();
      doc.destroy();
    };
  }, [fileId, textareaRef]);

  /**
   * 사용자 입력 핸들러 (onInput)
   *
   * Textarea의 변경된 값을 감지하여 Yjs 문서에 반영합니다.
   * 전체 텍스트를 덮어쓰지 않고, 변경된 부분(Diff)만 계산하여 효율적으로 업데이트합니다.
   */
  const handleInput = () => {
    const doc = ydocRef.current;
    const textarea = textareaRef.current;

    // Ref가 연결되지 않았거나 Doc이 없으면 중단
    if (!doc || !textarea) return;

    const newText = textarea.value;
    const yText = doc.getText("content");
    const currentText = yText.toString();

    if (newText === currentText) return;

    // Diff 알고리즘으로 변경 사항 계산 (Insert/Delete/Equal)
    const changes = diff(currentText, newText);

    doc.transact(() => {
      let index = 0;
      changes.forEach(([kind, value]) => {
        if (kind === 0) {
          index += value.length;
        } else if (kind === -1) {
          yText.delete(index, value.length);
        } else {
          yText.insert(index, value);
          index += value.length;
        }
      });
    }, "local"); // 'local' 태그를 붙여 Observer 루프 방지
  };

  return { handleInput };
}

const toBase64 = (bytes: Uint8Array): string => {
  return btoa(String.fromCharCode(...Array.from(bytes)));
};

const fromBase64 = (base64: string): Uint8Array => {
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
};
