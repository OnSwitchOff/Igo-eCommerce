import { Controller, Get, Post, Body, Param, NotFoundException  } from '@nestjs/common';
import { UsersService } from './users.service';
import type { User } from './interfaces/users.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll(): User[] {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() body: { name: string; age: number }): User {
    return this.usersService.createUser(body.name, body.age);
  }

  @Get(':id')
  getById(@Param('id') id: string): User {
    const user = this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}