import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { env } from '../../config/env';
import { JwtPayload } from '../../graphql/context';
import { ConflictError, UnauthorizedError, NotFoundError, } from '../../errors';
import { AuthRepository } from './auth.repository';
import { LoginInput, RegisterInput } from './auth.schema';

// ─── Types ───────────────────────────────────────────────────────────────────

interface TokenPair {
  accessToken: string,
  refreshToken: string
}

interface AuthResult extends TokenPair {
  user: {
    id: string,
    username: string,
    email: string
  },
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

// ─── Auth operations ─────────────────────────────────────────────────────────

const AuthService = {
  async register(input: RegisterInput, deviceId?: string, deviceInfo?: string): Promise<AuthResult> {
    const existing = await AuthRepository.findUserByEmailOrUsername(input.email, input.username);

    if (existing) {
      throw new ConflictError(
        existing.email === input.email
          ? 'Email already in use!'
          : 'Username already taken!'
      );
    }

    const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);

    const user = await AuthRepository.createUser({
      username: input.username,
      email: input.email,
      password: passwordHash,
    });

    const tokens = await issueTokenPair(user, deviceId, deviceInfo);
    return { ...tokens, user: { id: user.id, username: user.username, email: user.email } };
  },

  async login(input: LoginInput, deviceId?: string, deviceInfo?: string): Promise<AuthResult> {
    const user = await AuthRepository.findUserByEmail(input.email);

    // Constant-time compare — don't short-circuit on missing user
    // to prevent user enumeration via timing attack
    const isValid = await bcrypt.compare(input.password, user?.password ?? DUMMY_HASH);

    if (!user || !isValid) {
      throw new UnauthorizedError('Invalid email or password!');
    }

    const tokens = await issueTokenPair(user, deviceId, deviceInfo);
    return { ...tokens, user: { id: user.id, username: user.username, email: user.email } };
  },

  async refresh(token: string, deviceId?: string, deviceInfo?: string): Promise<TokenPair> {
    const record = await AuthRepository.findRefreshToken(hashToken(token));

    if (!record) {
      throw new UnauthorizedError('Invalid refresh token!');
    }

    // Reuse detected — this token was already consumed.
    // Nuke the entire family to invalidate all sessions derived from it.
    if (record.usedAt) {
      if (record.deviceId) {
        await AuthRepository.deleteDeviceTokens(record.userId, record.deviceId);
      }
      throw new UnauthorizedError('Token reuse detected — session revoked!');
    }

    if (record.expiresAt < new Date()) {
      await AuthRepository.deleteRefreshToken(hashToken(token));
      throw new UnauthorizedError('Refresh token has expired!');
    }

    // Consume old token and issue new one in same device slot
    await AuthRepository.consumeRefreshToken(record.id);
    return issueTokenPair(record.user, deviceId ?? record.deviceId ?? undefined, deviceInfo);
  },

  async logout(token: string): Promise<void> {
    await AuthRepository.deleteRefreshToken(hashToken(token));
  },

  async logoutAll(userId: string): Promise<void> {
    await AuthRepository.deleteAllUserTokens(userId);
  },

  async getUserById(userId: string) {
    const user = await AuthRepository.findUserById(userId);

    if (!user) {
      throw new NotFoundError('User not found!');
    }
    return user;
  }
};


// ─── Internal ────────────────────────────────────────────────────────────────

const issueTokenPair = async (user: { id: string; email: string; username: string }, deviceId?: string, deviceInfo?: string): Promise<TokenPair> => {
  if (deviceId) {
    await AuthRepository.deleteDeviceTokens(user.id, deviceId);
  }

  const refreshToken = generateRefreshToken();

  await AuthRepository.createRefreshToken({
    tokenHash: hashToken(refreshToken),
    userId: user.id,
    deviceId,
    deviceInfo,
    expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_TTL_MS * 1000)
  });

  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    username: user.username,
  });

  return { accessToken, refreshToken };
};



export {
  type TokenPair,
  AuthService
}