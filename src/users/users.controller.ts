import { Controller, Get, Post, Body, Param, NotFoundException  } from '@nestjs/common';
import { UsersService } from './users.service';
import type { User } from './interfaces/users.interface';
import {CreateUserInput, createUserSchema} from "./schemas/create-user.schema";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Post()
  async createUser(@Body() body: any) {
    const validated: CreateUserInput = createUserSchema.parse(body);
    return this.usersService.createUser(
        validated.name,
        validated.email,
        validated.password,
        validated.age,
    );
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<User> {
    const user = this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}