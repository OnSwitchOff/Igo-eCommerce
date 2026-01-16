import { Module } from '@nestjs/common';
import { CatsController } from './users.controller';
import { CatsService } from './users.service';

@Module({
	controllers:[UsersController],
	providers: [UsersService]
})
export class UsersModule {}
