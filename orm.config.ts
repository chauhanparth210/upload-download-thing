import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

const ORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrationsTableName: 'migrations',
  migrations: ['dist/**/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

// LINK: https://github.com/typeorm/typeorm/issues/4068#issuecomment-491500829
export = ORMConfig;
