import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { User } from '../user/entities/user.entity';
import { Skill } from '../skill/entities/skill.entity';
import { Review } from '../review/entities/review.entity';
import { Feedback } from '../feedback/entities/feedback.entity';
import { Goal } from '../goal/entities/goal.entity';

dotenv.config();

const dbConfig = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT ?? 5433),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: ['dist/src/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*.{ts,js}'],
  synchronize: false, // Must be false for migrations
  namingStrategy: new SnakeNamingStrategy(),
});

export default dbConfig;
