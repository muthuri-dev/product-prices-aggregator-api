import { Module } from '@nestjs/common';
import { AmazonService } from './amazon.service';
import { HttpModule } from '@nestjs/axios';
import { RedisModule } from '../redis/redis.module';
import { SearchModule } from '../search/search.module';
import { BrightDataModule } from '../bright-data/bright-data.module';

@Module({
  imports: [HttpModule, RedisModule, SearchModule, BrightDataModule],
  providers: [AmazonService],
  exports: [AmazonService],
})
export class AmazonModule {}
