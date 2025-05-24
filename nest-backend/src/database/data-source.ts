import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { User } from 'src/user/entities/user.entity';
import { Skill } from 'src/skill/entities/skill.entity';
import { Review } from 'src/review/entities/review.entity';
import { Feedback } from 'src/feedback/entities/feedback.entity';
import { Goal } from 'src/goal/entities/goal.entity';

dotenv.config();

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT ?? 5433),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  migrations: ['../src/database/migrations/*{.ts,.js}'],
  entities: [User, Skill, Review, Feedback, Goal],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
};

const dbConfig = new DataSource(dataSourceOptions);

export default dbConfig;
