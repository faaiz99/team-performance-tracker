import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config();

const dbConfig = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT ?? 5433),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  // entities: ['src/../**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*.{ts,js}'],
  synchronize: true, // Must be false for migrations
  namingStrategy: new SnakeNamingStrategy(),
});

export default dbConfig;
