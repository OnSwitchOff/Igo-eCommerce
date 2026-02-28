import {z} from "zod";
export const UserResponseSchema = z.object({
    id: z.uuid(),
    age: z.string(),
    name: z.string(),
    email: z.email()
});

export type UserResponse = z.infer<typeof UserResponseSchema>;