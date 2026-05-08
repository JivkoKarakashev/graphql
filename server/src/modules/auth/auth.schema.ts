import { z } from 'zod';

import { UserSchema } from '../../generated/zod/schemas';

const registerUserSchema = UserSchema
  .omit({ id: true })
  .extend({
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

const loginUserSchema = UserSchema
  .omit({ id: true, username: true })
  .extend({
    email: z.email('Valid email address is required!'),
    password: z.string().min(6, 'Password is required!'),
  });

type RegisterUserInput = z.infer<typeof registerUserSchema>;
type LoginUserInput = z.infer<typeof loginUserSchema>;

export {
  registerUserSchema,
  loginUserSchema,
  type RegisterUserInput,
  type LoginUserInput
}