import express from 'express';
import cookieParser from 'cookie-parser';

import authRoutes from './modules/auth/auth.routes';
import { errorHandler } from './middleware/errorHandler';
import { env } from './config/env';

export const app = express();

app.use(cookieParser());
app.use(express.json());

app.get('/internal/health', (_req, res) => res.json({ status: 'ok', environment: env.NODE_ENV }));
app.use('/auth', authRoutes);

app.use(errorHandler)