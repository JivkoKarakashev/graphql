import express from 'express';
import cookieParser from 'cookie-parser';

import authRoutes from './modules/auth/auth.routes';
import { errorHandler } from './middleware/errorHandler';

export const app = express();

app.use(cookieParser());
app.use(express.json());

app.use('/auth', authRoutes);

app.use(errorHandler)