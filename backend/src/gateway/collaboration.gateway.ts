import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import * as Y from 'yjs';
import { IncomingMessage } from 'http';
import { NotesService } from 'src/notes/notes.service';

interface ClientSocket extends WebSocket {
  fileId?: string;
}

interface Room {
  doc: Y.Doc; // 해당 fileId의 Y.Doc 인스턴스
  clients: Set<ClientSocket>; // 이 Room에 연결된 모든 클라이언트
  // awareness는 서버가 상태를 계속 저장하기보다, 클라이언트 간의 중계 역할이 큽니다.
  // 필요하다면 여기에 Awareness 인스턴스를 둘 수도 있지만,
  // WebSocket 레벨에서는 주로 메시지 브로드캐스팅으로 처리합니다.
}

@WebSocketGateway({ path: '/yjs' })
export class CollaborationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly notesService: NotesService) {}

  @WebSocketServer()
  server: Server;

  private rooms = new Map<string, Room>();

  /**
   * 클라이언트 연결 처리
   *
   * WebSocket 연결을 처리하고, fileId에 따라 클라이언트를 적절한 Room에 할당합니다.
   * Room이 없으면 새로 생성하고, DB에서 초기 콘텐츠를 로드합니다.
   * 연결된 클라이언트에게는 현재 문서의 전체 상태를 전송하여 동기화합니다.
   *
   * @param client - 연결된 클라이언트 소켓 객체
   * @param request - 클라이언트의 연결 요청 객체. URL에서 fileId를 추출하는 데 사용됩니다.
   */
  async handleConnection(client: ClientSocket, request: IncomingMessage) {
    // 쿼리 파라미터로 fileId 받음
    const urlParams = new URLSearchParams(request.url?.split('?')[1]);
    const fileId = urlParams.get('fileId');

    if (!fileId) {
      client.close();
      return;
    }

    // 클라이언트 객체에 fileId 저장 (나중에 메시지 보낼 때 어떤 방인지 알기 위함)
    client.fileId = fileId;

    // Room이 없을 경우 -> 생성 및 초기화
    if (!this.rooms.has(fileId)) {
      console.log(`[Room 생성] fileId: ${fileId}`);
      const doc = new Y.Doc();

      try {
        // DB에서 초기 콘텐츠 조회
        const fileContent = await this.notesService.getFile(fileId);
        doc.getText('content').insert(0, String(fileContent));
      } catch (err) {
        if (err instanceof Error) console.error(`DB 로딩 실패: ${fileId}`, err);
      }

      this.rooms.set(fileId, {
        doc,
        clients: new Set(),
      });
    }

    // Room이 있을 경우 (또는 생성 후) -> 클라이언트 추가
    const room = this.rooms.get(fileId);
    if (room) {
      room.clients.add(client);

      console.log(`[Room 입장] ${fileId} (총 ${room.clients.size}명)`);

      // sync 타입: 초기 동기화 절차
      // 접속하자마자 현재 서버가 가진 문서 상태(Binary)를 클라이언트에게 전송합니다.
      // Yjs에서는 'StateAsUpdate'를 보내면 클라이언트가 전체 상태를 맞출 수 있습니다.
      const initialSyncData = Y.encodeStateAsUpdate(room.doc);
      this.sendToClient(client, {
        type: 'sync',
        data: this.toBase64(initialSyncData), // 바이너리를 전송하기 위해 Base64 문자열 변환
      });
    }
  }

  /**
   * 클라이언트 연결 해제 처리
   *
   * 클라이언트의 연결이 끊어졌을 때 호출됩니다.
   * 해당 클라이언트를 Room에서 제거하고, Room에 더 이상 클라이언트가 없으면
   * Room을 메모리에서 삭제하여 리소스를 정리합니다.
   *
   * @param client - 연결이 해제된 클라이언트 소켓 객체
   */
  handleDisconnect(client: ClientSocket) {
    const fileId = client.fileId;
    if (fileId) {
      const room = this.rooms.get(fileId);

      if (room) {
        room.clients.delete(client);
        console.log(
          `[Room 퇴장] ${fileId} (남은 인원: ${room.clients.size}명)`,
        );

        if (room.clients.size === 0) {
          console.log(`[Room 삭제] ${fileId}`);
          room.doc.destroy();
          this.rooms.delete(fileId);
        }
      }
    }
  }

  /**
   * 클라이언트로부터 메시지를 수신하고 처리합니다.
   *
   * Yjs 클라이언트로부터 'update' 또는 'awareness'와 같은 메시지를 받아,
   * 해당 Room의 Y.Doc에 변경사항을 적용하고 다른 클라이언트들에게 브로드캐스트합니다.
   *
   * @param client - 메시지를 보낸 클라이언트 소켓
   * @param payload - 클라이언트가 전송한 데이터({ type, content }). Yjs 업데이트 메시지 등을 포함합니다.
   */
  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody() payload: { type: string; content: string },
  ) {
    const fileId = client.fileId;

    if (!fileId || !this.rooms.has(fileId)) return;
    const room = this.rooms.get(fileId)!;

    const { type, content } = payload;

    if (type === 'update') {
      try {
        const update = this.fromBase64(content);

        // 서버 문서 업데이트
        Y.applyUpdate(room.doc, update);

        // room의 다른 클라이언트에게 브로드캐스트
        room.clients.forEach((otherClient) => {
          if (
            otherClient !== client &&
            otherClient.readyState === WebSocket.OPEN
          ) {
            this.sendToClient(otherClient, {
              type: 'update',
              data: content,
            });
          }
        });
      } catch (e) {
        console.error('Update 처리 중 에러:', e);
      }
    }
  }

  private sendToClient(client: ClientSocket, message: any) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }

  private toBase64(bytes: Uint8Array): string {
    return Buffer.from(bytes).toString('base64');
  }

  private fromBase64(base64: string): Uint8Array {
    return new Uint8Array(Buffer.from(base64, 'base64'));
  }
}
