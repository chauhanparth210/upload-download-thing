import { Module } from '@nestjs/common';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import * as typeOrmConfigration from 'orm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfigration),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
  providers: [AppService, AppResolver],
})
export class AppModule {}
