import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { userProviders } from './user.provider';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [UserController],
  providers: [UserService, ...userProviders],
  imports: [DatabaseModule],
})
export class UserModule {}
