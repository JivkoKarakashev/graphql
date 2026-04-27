import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { prisma } from '../config/db';
import { env } from '../config/env';

export const createContext = async ({ req, res }: { req: Request, res: Response }) => {
  let user = null;

  // access token (header)
  const auth = req.headers.authorization;

  if (auth?.startsWith('Bearer ')) {
    try {
      const token = auth.split(' ')[1];
      const decoded: any = jwt.verify(token, env.ACCESS_SECRET);

      user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });
    } catch { }
  }

  return {
    req,
    res,
    prisma,
    user,
  };
};