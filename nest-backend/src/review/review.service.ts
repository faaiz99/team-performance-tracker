import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class ReviewService {
  constructor(
    @Inject('REVIEW_REPOSITORY')
    private readonly reviewRepository: Repository<Review>,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const { summary, rating, userId, reviewerId } = createReviewDto;
    const user = await this.userRepository.findOneBy({ id: userId });
    const reviewer = await this.userRepository.findOneBy({ id: reviewerId });

    if (!user || !reviewer) {
      throw new NotFoundException('User or reviewer not found');
    }

    const review = this.reviewRepository.create({
      summary,
      rating,
      user,
      reviewer,
    });

    return this.reviewRepository.save(review);
  }

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{
    reviews: Review[];
    page: number;
    limit: number;
    total: number;
  }> {
    const skip = (page - 1) * limit;
    const [reviews, total] = await this.reviewRepository.findAndCount({
      skip,
      take: limit,
      relations: ['user', 'reviewer'],
    });

    return {
      reviews,
      page,
      limit,
      total,
    };
  }

  async findOne(id: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user', 'reviewer'],
    });
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
    await this.reviewRepository.update(id, updateReviewDto);
    const updated = await this.reviewRepository.findOne({ where: { id } });
    if (!updated) throw new NotFoundException('Review not found');
    return updated;
  }

  async remove(id: number): Promise<void> {
    const result = await this.reviewRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Review not found');
  }
}
