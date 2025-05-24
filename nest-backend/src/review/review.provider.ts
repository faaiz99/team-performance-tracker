import { DataSource } from 'typeorm';
import { Review } from './entities/review.entity';
export const reviewProviders = [
  {
    provide: 'REVIEW_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Review),
    inject: ['DATA_SOURCE'],
  },
];
