import { User } from '../user/entities/user.entity';
import { Skill } from '../skill/entities/skill.entity';
import { Review } from '../review/entities/review.entity';
import { Feedback } from '../feedback/entities/feedback.entity';
import { Goal } from '../goal/entities/goal.entity';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        ssl: false,
        entities: [User, Skill, Review, Feedback, Goal],
        migrations: ['src/database/migrations/*.{ts,js}'],
        synchronize: false,
      });

      return dataSource.initialize();
    },
  },
];
