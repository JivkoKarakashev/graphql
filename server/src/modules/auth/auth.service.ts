import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { prisma } from '../../config/db';
import { env } from '../../config/env';
import { ConflictError, UnauthorizedError, NotFoundError, } from '../../errors';

// ─── Types ───────────────────────────────────────────────────────────────────
interface JwtPayload {
  userId: string,
  email: string,
  username: string
}

interface TokenPair {
  accessToken: string,
  refreshToken: string
}

interface RegisterInput {
  username: string,
  email: string,
  password: string
}

interface LoginInput {
  email: string,
  password: string
}

const DUMMY_HASH = bcrypt.hashSync('dummy-timing-protection', env.BCRYPT_ROUNDS);

// ─── Token helpers ───────────────────────────────────────────────────────────

// SHA-256 is appropriate here — refresh tokens are already
// high-entropy random strings, so bcrypt's slow hashing is unnecessary.
// We only need to protect against DB breach exposure.
const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_TTL
  });
};

const generateRefreshToken = (): string => {
  return crypto.randomBytes(64).toString('hex');
};

const persistRefreshToken = async (userId: string, familyId: string, rawToken: string, deviceInfo?: string) => {
  return prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(rawToken),
      familyId,
      userId,
      deviceInfo,
      expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_TTL_MS * 1000),
    },
  });
};

// ─── Auth operations ─────────────────────────────────────────────────────────

const register = async (input: RegisterInput, deviceInfo?: string): Promise<TokenPair> => {
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email: input.email }, { username: input.username }],
    },
  });

  if (existing) {
    throw new ConflictError(
      existing.email === input.email
        ? 'Email already in use!'
        : 'Username already taken!'
    );
  }

  const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      username: input.username,
      email: input.email,
      password: passwordHash,
    },
  });

  return issueTokenPair(user, deviceInfo);
};

const login = async (input: LoginInput, deviceInfo?: string): Promise<TokenPair> => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  // Constant-time compare — don't short-circuit on missing user
  // to prevent user enumeration via timing attack
  const isValid = await bcrypt.compare(input.password, user?.password ?? DUMMY_HASH);

  if (!user || !isValid) {
    throw new UnauthorizedError('Invalid email or password!');
  }

  return issueTokenPair(user, deviceInfo);
};

const refresh = async (incomingToken: string, deviceInfo?: string): Promise<TokenPair> => {
  const record = await prisma.refreshToken.findUnique({
    where: { tokenHash: hashToken(incomingToken) },
    include: { user: true },
  });

  if (!record) {
    throw new UnauthorizedError('Invalid refresh token!');
  }

  // Reuse detected — this token was already consumed.
  // Nuke the entire family to invalidate all sessions derived from it.
  if (record.usedAt) {
    await prisma.refreshToken.updateMany({
      where: { familyId: record.familyId },
      data: { revokedAt: new Date() },
    });
    throw new UnauthorizedError('Refresh token reuse detected — all sessions revoked!');
  }

  if (record.revokedAt) {
    throw new UnauthorizedError('Refresh token has been revoked!');
  }

  if (record.expiresAt < new Date()) {
    throw new UnauthorizedError('Refresh token has expired!');
  }

  // Consume the old token
  await prisma.refreshToken.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });

  // Issue new pair in the same family
  return issueTokenPair(record.user, deviceInfo, record.familyId);
};

const logout = async (incomingToken: string): Promise<void> => {
  await prisma.refreshToken.updateMany({
    where: { tokenHash: hashToken(incomingToken) },
    data: { revokedAt: new Date() },
  });
};

const logoutAll = async (userId: string): Promise<void> => {
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
};

const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, email: true, createdAt: true },
  });

  if (!user) {
    throw new NotFoundError('User not found!');
  }
  return user;
};

// ─── Internal ────────────────────────────────────────────────────────────────

const issueTokenPair = async (user: { id: string; email: string; username: string }, deviceInfo?: string, existingFamilyId?: string): Promise<TokenPair> => {
  const familyId = existingFamilyId ?? crypto.randomUUID();
  const refreshToken = generateRefreshToken();

  await persistRefreshToken(user.id, familyId, refreshToken, deviceInfo);

  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    username: user.username,
  });

  return { accessToken, refreshToken };
};

export {
  type JwtPayload,
  type TokenPair,
  type RegisterInput,
  type LoginInput,
  register,
  login,
  refresh,
  logout,
  logoutAll,
  getUserById
}