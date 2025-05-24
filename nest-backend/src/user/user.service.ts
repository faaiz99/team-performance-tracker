import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

async findAll(page = 1, limit = 10): Promise<{
  users: User[];
  page: number;
  limit: number;
  total: number;
}> {
  const skip = (page - 1) * limit;
  const [users, total] = await this.userRepository.findAndCount({
    skip,
    take: limit,
  });

  return {
    users,
    page,
    limit,
    total,
  };
}

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}