import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { WsTestController } from './ws-test.controller';

@Module({
  controllers: [WsTestController],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
