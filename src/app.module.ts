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
import { SearchService } from './search/search.service';
import { RedisModule } from './redis/redis.module';

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
  ],
  controllers: [],
  providers: [ConfirmEmailService, RedisService, SearchService],
})
export class AppModule {}
