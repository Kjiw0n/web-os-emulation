import { Body, Controller, Post, Query } from '@nestjs/common';
import { RedisService } from './redis.service';
import { randomUUID } from 'crypto';

@Controller('ws-test')
export class WsTestController {
  constructor(private readonly redisService: RedisService) {}

  /**
   * 다른 인스턴스가 Redis로 publish하는 상황을 시뮬레이션.
   * 브라우저 테스트 페이지(ws-test.html)에서 사용.
   */
  @Post('publish')
  async publish(
    @Query('fileId') fileId: string,
    @Body() body: { updateB64?: string },
  ) {
    const updateB64 = body.updateB64 ?? 'AAA=';
    const fakeInstanceId = `test-instance-${randomUUID()}`;
    await this.redisService.publishUpdate(fileId, updateB64, fakeInstanceId);
    return { ok: true, fileId, fakeInstanceId };
  }
}
