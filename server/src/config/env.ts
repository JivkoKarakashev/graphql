import dotenvFlow from 'dotenv-flow';
dotenvFlow.config();

import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  LISTENING_PORT: z.coerce.number(),
  DATABASE_URL: z.string(),
  ACCESS_SECRET: z.string().min(32),
  REFRESH_SECRET: z.string().min(32),
  CLIENT_URL: z.url(),
});

export const env = envSchema.parse(process.env);