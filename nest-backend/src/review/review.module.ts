import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { reviewProviders } from './review.provider';
import { userProviders } from 'src/user/user.provider';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, ...reviewProviders, ...userProviders],
  imports: [DatabaseModule],
})
export class ReviewModule {}
