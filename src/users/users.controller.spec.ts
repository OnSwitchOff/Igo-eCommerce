import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import type  { User } from './interfaces/users.interface';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('getAll', () => {
    it('should return an array of users', () => {
      // seed some users
      usersService.createUser('Alice', 25);
      usersService.createUser('Bob', 30);

      const users = usersController.getAll();
      expect(users).toHaveLength(2);
      expect(users[0].name).toBe('Alice');
      expect(users[1].name).toBe('Bob');
    });
  });

  describe('create', () => {
    it('should create a new user', () => {
      const user: User = usersController.create({ name: 'Charlie', age: 22 });
      expect(user).toHaveProperty('id');
      expect(user.name).toBe('Charlie');
      expect(user.age).toBe(22);
    });
  });

  describe('getById', () => {
    it('should return a user by id', () => {
      const user = usersService.createUser('Dave', 40);
      const found = usersController.getById(user.id);
      expect(found).toEqual(user);
    });

    it('should throw NotFoundException if user does not exist', () => {
      expect(() => usersController.getById('non-existing-id'))
      .toThrow('User with ID non-existing-id not found');
    });
  });
});