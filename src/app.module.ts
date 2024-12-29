import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'node:path';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ConfirmEmailService } from './emails/confirm-email.service';
import { RedisService } from './redis/redis.service';
import { ProductModule } from './product/product.module';
import { RedisModule } from './redis/redis.module';
import { AmazonModule } from './amazon/amazon.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SearchModule } from './search/search.module';
import { BrightDataModule } from './bright-data/bright-data.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      sortSchema: true,
      context: ({ req }) => ({ req }),
    }),
    AuthModule,
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ProductModule,
    RedisModule,
    AmazonModule,
    NotificationsModule,
    SearchModule,
    BrightDataModule,
  ],
  controllers: [],
  providers: [ConfirmEmailService, RedisService],
})
export class AppModule {}
