import { User } from './users.entity';
import {
  UserResponse,
  UserResponseSchema,
} from './schemas/user-response.schema';

export function toUserResponse(user: User): UserResponse {
  return UserResponseSchema.parse({
    id: user.id,
    age: user.age,
    name: user.name,
    email: user.email,
  });
}
