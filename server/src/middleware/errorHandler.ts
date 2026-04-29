import { NextFunction, Request, Response } from 'express';
import z, { ZodError } from 'zod';

import { AppError } from '../errors';
import { Prisma } from '../generated/prisma/client';

const PRISMA_ERROR_MAP: Record<string, { status: number; message: string }> = {
  P2002: { status: 409, message: 'A record with this value already exists!' },
  P2025: { status: 404, message: 'Record not found!' },
  P2003: { status: 400, message: 'Related record not found!' },
  P2014: { status: 400, message: 'Invalid relation data!' },
};

const isProd = process.env.NODE_ENV === 'production';

const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  // Always log with request context
  console.error({
    method: req.method,
    path: req.path,
    error: err,
  });

  // 1. Our own typed errors — safe to expose message directly
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
    });
    return;
  }

  // 2. Zod validation errors — malformed input from client
  if (err instanceof ZodError) {
    res.status(400).json({
      code: 'VALIDATION_ERROR',
      message: 'Invalid input',
      fields: z.treeifyError(err)
    });
    return;
  }

  // 3. Prisma known errors — DB-level constraint violations etc.
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const mapped = PRISMA_ERROR_MAP[err.code];
    if (mapped) {
      res.status(mapped.status).json({
        code: `PRISMA_${err.code}`,
        message: mapped.message,
      });
      return;
    }
  }

  // 4. Prisma validation errors — bad query shape (usually a code bug)
  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      code: 'DATABASE_VALIDATION_ERROR',
      message: isProd ? 'Invalid request' : err.message,
    });
    return;
  }

  // 5. Unhandled errors — never leak internals in production
  res.status(500).json({
    code: 'INTERNAL_SERVER_ERROR',
    message: isProd ? 'Something went wrong' : (err instanceof Error ? err.message : 'Unknown error'),
  });
};

export {
  errorHandler
}