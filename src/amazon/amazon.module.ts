import { Module } from '@nestjs/common';
import { AmazonService } from './amazon.service';
import { HttpModule } from '@nestjs/axios';
import { SearchService } from '../search/search.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [HttpModule, RedisModule],
  providers: [AmazonService, SearchService],
  exports: [AmazonService],
})
export class AmazonModule {}
