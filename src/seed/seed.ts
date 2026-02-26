import { AppDataSource } from '../db/data-source';
import { User } from '../users/users.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
    await AppDataSource.initialize();

    const userRepository = AppDataSource.getRepository(User);

    const usersData = [
        { name: 'Alice', email: 'alice@example.com', password: 'password123', age: 25 },
        { name: 'Bob', email: 'bob@example.com', password: 'password123', age: 30 },
        { name: 'Charlie', email: 'charlie@example.com', password: 'password123', age: 22 },
    ];

    for (const u of usersData) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        const user = userRepository.create({ ...u, password: hashedPassword });
        console.log("user",user);
        await userRepository.save(user);
        console.log(`Inserted user: ${u.name}`);
    }

    await AppDataSource.destroy();
    console.log('Seeding finished!');
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});