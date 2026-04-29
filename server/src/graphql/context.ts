import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { prisma } from '../config/db';
import { env } from '../config/env';

interface JwtPayload {
  userId: string,
  email: string,
  username: string
}

type AuthError = 'TOKEN_EXPIRED' | 'TOKEN_INVALID' | null;

interface AppContext {
  req: Request,
  res: Response,
  prisma: typeof prisma,
  user: JwtPayload | null,
  authError: AuthError
}

const extractToken = (req: Request): string | null => {
  if (req.cookies?.accessToken) {
    return req.cookies.accessToken;
  }
  const auth = req.headers.authorization;
  if (auth?.startsWith('Bearer ')) {
    return auth.split(' ')[1];
  }
  return null;
}

const createContext = async ({ req, res }: { req: Request, res: Response }): Promise<AppContext> => {
  let user: JwtPayload | null = null;
  let authError: AuthError = null;

  const token = extractToken(req);

  if (token) {
    try {
      user = jwt.verify(token, env.ACCESS_SECRET) as JwtPayload;
    } catch (err) {
      authError = err instanceof jwt.TokenExpiredError
        ? 'TOKEN_EXPIRED'
        : 'TOKEN_INVALID';
    }
  }

  return { req, res, prisma, user, authError };
};

export {
  type JwtPayload,
  type AuthError,
  type AppContext,
  createContext
}