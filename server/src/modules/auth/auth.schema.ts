import { z } from 'zod';

const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be at most 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores!'),
  email: z
    .email('Valid email address is required!'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters!')
    .max(72, 'Password must be at most 72 characters!')
    // .regex(/[A-Z]/, 'Password must contain at least one uppercase letter!')
    // .regex(/[0-9]/, 'Password must contain at least one number!'),
});

const loginSchema = z.object({
  email: z.email('Valid email address is required!'),
  password: z.string().min(6, 'Password is required!'),
});

type RegisterInput = z.infer<typeof registerSchema>;
type LoginInput = z.infer<typeof loginSchema>;

export {
  registerSchema,
  loginSchema,
  type RegisterInput,
  type LoginInput
}