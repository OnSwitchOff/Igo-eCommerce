import { Repository } from 'typeorm';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';

/**
 * Custom repository for User entity.
 * Wraps common queries and user-specific operations.
 */
export class UsersRepository extends Repository<User> {
    /** Create a new user with hashed password */
    public async createUser(
        name: string,
        email: string,
        password: string,
        age: number,
    ): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.create({ name, email, password: hashedPassword, age });
        return this.save(user);
    }

    /** Find all users, newest first */
    public async findAllUsers(): Promise<User[]> {
        return await this.find({ order: { createdAt: 'DESC' } });
    }

    /** Find a user by UUID */
    public async findById(id: string): Promise<User | null> {
        return this.findOne({ where: { id } });
    }

    /** Find a user by email */
    public async findByEmail(email: string): Promise<User | null> {
        return this.findOne({ where: { email } });
    }

    /** Delete a user by UUID */
    public async deleteById(id: string): Promise<boolean> {
        const { affected } = await this.delete(id);
        return (affected ?? 0) > 0;
    }

    /** Update user info: name, age, email */
    public async updateUser(
        id: string,
        updateData: Partial<Pick<User, 'name' | 'age' | 'email'>>,
    ): Promise<User | null> {
        const user = await this.findById(id);
        if (!user) return null;
        Object.assign(user, updateData);
        return this.save(user);
    }

    /** Update user password */
    public async updatePassword(id: string, newPassword: string): Promise<User | null> {
        const user = await this.findById(id);
        if (!user) return null;
        user.password = await bcrypt.hash(newPassword, 10);
        return this.save(user);
    }

    /** Validate user password */
    public async validatePassword(email: string, password: string): Promise<boolean> {
        const user = await this.findByEmail(email);
        if (!user) return false;
        return bcrypt.compare(password, user.password);
    }

    /** Optional: find users older than certain age */
    public async findOlderThan(age: number): Promise<User[]> {
        return this.createQueryBuilder('user')
            .where('user.age > :age', { age })
            .getMany();
    }
}