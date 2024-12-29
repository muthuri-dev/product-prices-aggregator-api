import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { SearchService } from '../search/search.service';
import { RedisModule } from '../redis/redis.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { HttpModule } from '@nestjs/axios';
import { AmazonModule } from '../amazon/amazon.module';

@Module({
  imports: [RedisModule, NotificationsModule, HttpModule, AmazonModule],
  providers: [ProductResolver, ProductService, SearchService],
  exports: [ProductService],
})
export class ProductModule {}
