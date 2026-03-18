import { Controller, Get, Render } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Render('users/list')
  async findAll() {
    const users = await this.usersService.findAll();
    return { users };
  }
}