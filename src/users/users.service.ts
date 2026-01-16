import { Injectable } from '@nestjs/common';
import type { User } from './interfaces/users.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  private users: User[] = [];

  findAll(): User[] {
    return this.users;
  }

  createUser(name: string, age: number): User {
    const user: User = {
      id: uuidv4(),
      name,
      age,
    };
    this.users.push(user);
    return user;
  }

  findById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }
}