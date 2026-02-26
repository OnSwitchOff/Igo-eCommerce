import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from './users.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  private readonly usersRepository: UsersRepository;
  constructor(private dataSource: DataSource) {
    const repo = this.dataSource.getRepository(User).extend(UsersRepository.prototype);
    console.log("rep",repo);
    console.log("rep",repo.constructor.name);
    console.log("rep",Object.getPrototypeOf(repo));
    console.log("rep",Object.getOwnPropertyNames(Object.getPrototypeOf(repo)));
    console.log("rep",Object.getOwnPropertyNames(UsersRepository.prototype));

    this.usersRepository = repo;
  }

  async createUser(name: string, email: string, password: string, age: number) {
    return this.usersRepository.createUser(name, email, password, age);
  }

  async findAll() {
    const users = await this.usersRepository.find({ order: { createdAt: 'DESC' } });
    console.log(users);
    return users;
  }

  async findById(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) throw new NotFoundException(`User with email ${email} not found`);
    return user;
  }

  async deleteById(id: string) {
    const deleted = await this.usersRepository.deleteById(id);
    if (!deleted) throw new NotFoundException(`User with id ${id} not found`);
  }

  async updateUser(id: string, updateData: Partial<Pick<User, 'name' | 'age' | 'email'>>) {
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