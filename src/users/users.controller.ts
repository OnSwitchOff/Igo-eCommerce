import { Controller, Get, Post, Body, Param, NotFoundException  } from '@nestjs/common';
import { UsersService } from './users.service';
import {CreateUserInput, createUserSchema} from "./schemas/create-user.schema";
import {toUserResponse} from "./users.mapper";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAll(){
    const users = await this.usersService.findAll();
    return users.map(u => toUserResponse(u));
  }

  @Post()
  async createUser(@Body() body: any) {
    const validated: CreateUserInput = createUserSchema.parse(body);
    const user = await this.usersService.createUser(
        validated.name,
        validated.email,
        validated.password,
        validated.age,
    );
    return toUserResponse(user);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return toUserResponse(user);
  }
}