import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { SearchService } from '../search/search.service';
import { RedisModule } from '../redis/redis.module';
import { RedisService } from '../redis/redis.service';

@Module({
  imports: [RedisModule],
  providers: [ProductResolver, ProductService, SearchService, RedisService],
  exports: [ProductService],
})
export class ProductModule {}
