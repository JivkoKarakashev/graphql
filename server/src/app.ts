import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { env } from './config/env';
import authRoutes from './modules/auth/auth.routes';

export const app = express();

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.get('/internal/health', (_req, res) => res.json({ status: 'ok', environment: env.NODE_ENV }));
app.use('/auth', authRoutes);