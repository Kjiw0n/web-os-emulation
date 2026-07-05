import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export type YjsUpdateHandler = (
  fileId: string,
  updateB64: string,
  senderInstanceId: string,
) => void;

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly pub: Redis;
  private readonly sub: Redis;

  private handlers = new Map<string, YjsUpdateHandler[]>();

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = this.configService.get<number>('REDIS_PORT', 6379);

    this.pub = new Redis({ host, port, lazyConnect: true });
    this.sub = new Redis({ host, port, lazyConnect: true });

    this.sub.on('message', (channel, message) => {
      this.handleRedisMessage(channel, message);
    });

    this.pub
      .connect()
      .catch((e) => this.logger.error('Redis pub connect 실패', e));
    this.sub
      .connect()
      .catch((e) => this.logger.error('Redis sub connect 실패', e));
  }

  private handleRedisMessage(channel: string, message: string) {
    // channel = "room:{fileId}"
    if (!channel.startsWith('room:')) return;
    const fileId = channel.slice('room:'.length);

    let parsed: { senderInstanceId: string; updateB64: string };
    try {
      parsed = JSON.parse(message);
    } catch {
      return;
    }

    const handlers = this.handlers.get(fileId) ?? [];
    handlers.forEach((h) => h(fileId, parsed.updateB64, parsed.senderInstanceId));
  }

  async subscribeRoom(fileId: string, handler: YjsUpdateHandler): Promise<void> {
    const channel = `room:${fileId}`;
    const existing = this.handlers.get(fileId) ?? [];

    if (existing.length === 0) {
      await this.sub.subscribe(channel);
      this.logger.debug(`[Redis] subscribed: ${channel}`);
    }

    this.handlers.set(fileId, [...existing, handler]);
  }

  async unsubscribeRoom(fileId: string, handler: YjsUpdateHandler): Promise<void> {
    const existing = this.handlers.get(fileId) ?? [];
    const next = existing.filter((h) => h !== handler);

    if (next.length === 0) {
      const channel = `room:${fileId}`;
      await this.sub.unsubscribe(channel);
      this.handlers.delete(fileId);
      this.logger.debug(`[Redis] unsubscribed: ${channel}`);
    } else {
      this.handlers.set(fileId, next);
    }
  }

  async publishUpdate(
    fileId: string,
    updateB64: string,
    senderInstanceId: string,
  ): Promise<void> {
    const channel = `room:${fileId}`;
    const message = JSON.stringify({ senderInstanceId, updateB64 });
    await this.pub.publish(channel, message);
  }

  async onModuleDestroy() {
    await this.pub.quit();
    await this.sub.quit();
  }
}
