import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Render,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-users.dto';
import { UsersService } from './users.service';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller('users')
@ApiExcludeController()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Render('users/list')
  async findAll() {
    const users = await this.usersService.findAll();
    return { pageTitle: 'Users', users };
  }

  @Get('add')
  @Render('users/add')
  addForm() {
    return { pageTitle: 'Add user' };
  }

  @Post()
  async create(@Body() dto: CreateUserDto, @Res() res: Response) {
    await this.usersService.create(dto);
    return res.redirect('/users');
  }

  @Get(':id')
  @Render('users/detail')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    return { pageTitle: `User #${id}`, user };
  }

  @Get(':id/edit')
  @Render('users/edit')
  async editForm(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    return { pageTitle: `Edit user #${id}`, user };
  }

  @Post(':id/edit')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @Res() res: Response,
  ) {
    await this.usersService.update(id, dto);
    return res.redirect(`/users/${id}`);
  }

  @Post(':id/delete')
  async remove(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    await this.usersService.remove(id);
    return res.redirect('/users');
  }
}