import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'node:path';
import { DatabaseModule } from './database/database.module';
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      sortSchema: true,
    }),
    AuthModule,
    DatabaseModule,
      ConfigModule.forRoot({isGlobal:true})
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
