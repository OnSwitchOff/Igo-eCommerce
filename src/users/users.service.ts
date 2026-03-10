import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './users.entity';
import { getUserRepository, UsersRepository } from './users.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@Inject() private usersRepository: UsersRepository) {}

  async createUser(name: string, email: string, password: string, age: number) {
    return this.usersRepository.createUser(name, email, password, age);
  }

  async findAll() {
    return await this.usersRepository.findAllUsers();
  }

  async findById(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user)
      throw new NotFoundException(`User with email ${email} not found`);
    return user;
  }

  async deleteById(id: string) {
    const deleted = await this.usersRepository.deleteById(id);
    if (!deleted) throw new NotFoundException(`User with id ${id} not found`);
  }

  async updateUser(
    id: string,
    updateData: Partial<Pick<User, 'name' | 'age' | 'email'>>,
  ) {
    const user = await this.usersRepository.updateUser(id, updateData);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  async updatePassword(id: string, newPassword: string) {
    const user = await this.usersRepository.updatePassword(id, newPassword);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  async validatePassword(email: string, password: string) {
    return this.usersRepository.validatePassword(email, password);
  }
}
