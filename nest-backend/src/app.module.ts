import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { GoalModule } from './goal/goal.module';
import { SkillModule } from './skill/skill.module';
import { FeedbackModule } from './feedback/feedback.module';
import { ReviewModule } from './review/review.module';
import { DatabaseModule } from './database/database.module';
import { configModule } from './config/env.config';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    configModule,
    UserModule,
    GoalModule,
    SkillModule,
    FeedbackModule,
    ReviewModule,
    DatabaseModule,
  ],
})
export class AppModule {}
