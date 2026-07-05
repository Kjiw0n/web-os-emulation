import { NoteDocumentManager } from './../notes/note-document.manager';
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
import { forwardRef, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { RedisService, YjsUpdateHandler } from 'src/redis/redis.service';

interface ClientSocket extends WebSocket {
  fileId?: string;
  isLobby?: boolean;
}

interface Room {
  doc: Y.Doc;
  clients: Set<ClientSocket>;
  redisHandler: YjsUpdateHandler;
}

@WebSocketGateway({ path: '/yjs' })
export class CollaborationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(forwardRef(() => NotesService))
    private readonly notesService: NotesService,
    private readonly noteDocumentManager: NoteDocumentManager,
    private readonly redisService: RedisService,
  ) {}

  @WebSocketServer()
  server: Server;

  private readonly instanceId = randomUUID();
  private rooms = new Map<string, Room>();
  private lobbyClients = new Set<ClientSocket>();

  async handleConnection(client: ClientSocket, request: IncomingMessage) {
    const urlParams = new URLSearchParams(request.url?.split('?')[1]);
    const fileId = urlParams.get('fileId');
    const mode = urlParams.get('mode');

    if (mode === 'list') {
      client.isLobby = true;
      this.lobbyClients.add(client);
      console.log(`[Lobby 입장] 현재 로비 인원: ${this.lobbyClients.size}명`);
      return;
    }

    if (!fileId) {
      client.close();
      return;
    }

    client.fileId = fileId;
    const fileIdNum = parseInt(fileId, 10);

    const doc = this.noteDocumentManager.getOrCreate(fileIdNum);

    if (!this.rooms.has(fileId)) {
      console.log(`[Room 생성] fileId: ${fileId}`);

      // Redis Pub/Sub 핸들러 — 다른 인스턴스의 update를 로컬 클라이언트에 relay
      const redisHandler: YjsUpdateHandler = (
        _fileId,
        updateB64,
        senderInstanceId,
      ) => {
        if (senderInstanceId === this.instanceId) return;

        const update = this.fromBase64(updateB64);
        this.noteDocumentManager.applyUpdate(fileIdNum, update);

        const room = this.rooms.get(fileId);
        if (!room) return;

        room.clients.forEach((c) => {
          if (c.readyState === WebSocket.OPEN) {
            this.sendToClient(c, { type: 'update', data: updateB64 });
          }
        });
      };

      this.rooms.set(fileId, { doc, clients: new Set(), redisHandler });
      await this.redisService.subscribeRoom(fileId, redisHandler);
    }

    const room = this.rooms.get(fileId);
    if (room) {
      room.clients.add(client);
      console.log(`[Room 입장] ${fileId} (총 ${room.clients.size}명)`);

      const initialSyncData = Y.encodeStateAsUpdate(room.doc);
      this.sendToClient(client, {
        type: 'sync',
        data: this.toBase64(initialSyncData),
      });
    }
  }

  async handleDisconnect(client: ClientSocket) {
    if (client.isLobby) {
      this.lobbyClients.delete(client);
      console.log(`[Lobby 퇴장] 남은 인원: ${this.lobbyClients.size}명`);
      return;
    }

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
          const fileIdNum = parseInt(fileId, 10);
          try {
            await this.notesService.createSnapshot(fileIdNum);
          } catch (e) {
            console.error(`[Room 삭제] 스냅샷 저장 실패 fileId=${fileId}:`, e);
          }
          await this.redisService.unsubscribeRoom(fileId, room.redisHandler);
          room.doc.destroy();
          this.rooms.delete(fileId);
        }
      }
    }
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: ClientSocket,
    @MessageBody() payload: { type: string; content: string },
  ) {
    const fileId = client.fileId;

    if (!fileId || !this.rooms.has(fileId)) return;
    const fileIdNum = parseInt(fileId, 10);
    const room = this.rooms.get(fileId)!;

    const { type, content } = payload;

    if (type === 'update') {
      try {
        const update = this.fromBase64(content);

        this.noteDocumentManager.applyUpdate(fileIdNum, update);

        // 같은 인스턴스 내 클라이언트에게 브로드캐스트
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

        // 다른 인스턴스에 Redis로 publish
        await this.redisService.publishUpdate(
          fileId,
          content,
          this.instanceId,
        );

        if (this.noteDocumentManager.shouldCreateSnapshot(fileIdNum)) {
          await this.notesService.createSnapshot(fileIdNum);
        }
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

  broadcastToLobby(event: 'create' | 'delete', data: any) {
    const message = JSON.stringify({
      type: 'note-list-update',
      event,
      data,
    });

    this.lobbyClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  private toBase64(bytes: Uint8Array): string {
    return Buffer.from(bytes).toString('base64');
  }

  private fromBase64(base64: string): Uint8Array {
    return new Uint8Array(Buffer.from(base64, 'base64'));
  }
}
