import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersApiController } from './api/users-api.controller';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController, UsersApiController],
  providers: [UsersService, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}