import {DataSource, Repository} from "typeorm";
import { User } from "./users.entity";
import * as bcrypt from 'bcrypt';
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";

/**
 * Custom repository for User entity.
 * Wraps common queries and user-specific operations.
 */

@Injectable()
export class UsersRepository {
    constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>,
    ) {}

    async createUser(
        name: string,
        email: string,
        password: string,
        age: number,
    ): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.repository.create({ name, email, password: hashedPassword, age });
        return this.repository.save(user);
    }
    async findAllUsers(): Promise<User[]> {
        return await this.repository.find({ order: { createdAt: 'DESC' } });
    }
    async findById(id: string): Promise<User | null> {
        return this.repository.findOne({ where: { id } });
    }
    async findByEmail(email: string): Promise<User | null> {
        return this.repository.findOne({ where: { email } });
    }
    async deleteById(id: string): Promise<boolean> {
        const { affected } = await this.repository.delete(id);
        return (affected ?? 0) > 0;
    }
    async updateUser(
        id: string,
        updateData: Partial<Pick<User, 'name' | 'age' | 'email'>>,
    ): Promise<User | null> {
        const user = await this.findById(id);
        if (!user) return null;
        Object.assign(user, updateData);
        return this.repository.save(user);
    }
    async updatePassword(id: string, newPassword: string): Promise<User | null> {
        const user = await this.findById(id);
        if (!user) return null;
        user.password = await bcrypt.hash(newPassword, 10);
        return this.repository.save(user);
    }
    async validatePassword(email: string, password: string): Promise<boolean> {
        const user = await this.findByEmail(email);
        if (!user) return false;
        return bcrypt.compare(password, user.password);
    }
    async findOlderThan(age: number): Promise<User[]> {
        return this.repository.createQueryBuilder('user')
            .where('user.age > :age', { age })
            .getMany();
    }
}



///alternative factory
export const getUserRepository = (dataSource: DataSource) =>
    dataSource.getRepository(User).extend({
        async createUser(
            name: string,
            email: string,
            password: string,
            age: number,
        ): Promise<User> {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = this.create({ name, email, password: hashedPassword, age });
            return this.save(user);
        },
        async findAllUsers(): Promise<User[]> {
            return await this.find({ order: { createdAt: 'DESC' } });
        },
        async findById(id: string): Promise<User | null> {
            return this.findOne({ where: { id } });
        },
        async findByEmail(email: string): Promise<User | null> {
            return this.findOne({ where: { email } });
        },
        async deleteById(id: string): Promise<boolean> {
            const { affected } = await this.delete(id);
            return (affected ?? 0) > 0;
        },
        async updateUser(
            id: string,
            updateData: Partial<Pick<User, 'name' | 'age' | 'email'>>,
        ): Promise<User | null> {
            const user = await this.findById(id);
            if (!user) return null;
            Object.assign(user, updateData);
            return this.save(user);
        },
        async updatePassword(id: string, newPassword: string): Promise<User | null> {
            const user = await this.findById(id);
            if (!user) return null;
            user.password = await bcrypt.hash(newPassword, 10);
            return this.save(user);
        },
        async validatePassword(email: string, password: string): Promise<boolean> {
            const user = await this.findByEmail(email);
            if (!user) return false;
            return bcrypt.compare(password, user.password);
        },
        async findOlderThan(age: number): Promise<User[]> {
            return this.createQueryBuilder('user')
                .where('user.age > :age', { age })
                .getMany();
        }
    });
