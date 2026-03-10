import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  age: z.number().int().min(0, 'Age must be a positive integer'),
});

// Optional: type inference for TypeScript
export type CreateUserInput = z.infer<typeof createUserSchema>;
