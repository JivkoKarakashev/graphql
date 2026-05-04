import { prisma } from '../../config/db';

const AuthRepository = {
  findUserByEmail: (email: string) => {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  findUserByEmailOrUsername: (email: string, username: string) => {
    return prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
  },

  createUser: (data: { username: string; email: string; password: string }) => {
    return prisma.user.create({ data });
  },

  findUserById: (id: string) => {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, username: true, email: true, createdAt: true },
    });
  },

  // ─── Refresh token operations ─────────────────────────────────────

  createRefreshToken: (data: {
    tokenHash: string,
    userId: string,
    deviceId?: string,
    deviceInfo?: string,
    expiresAt: Date
  }) => {
    return prisma.refreshToken.create({ data });
  },

  findRefreshToken: (tokenHash: string) => {
    return prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });
  },

  findActiveDeviceToken: (userId: string, deviceId: string) => {
    return prisma.refreshToken.findFirst({
      where: {
        userId,
        deviceId,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
  },

  consumeRefreshToken: (id: string) => {
    return prisma.refreshToken.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  },

  // Hard delete — used on logout and expiry
  deleteRefreshToken: (tokenHash: string) => {
    return prisma.refreshToken.deleteMany({
      where: { tokenHash },
    });
  },

  // Hard delete all tokens for this device
  deleteDeviceTokens: (userId: string, deviceId: string) => {
    return prisma.refreshToken.deleteMany({
      where: { userId, deviceId },
    });
  },

  // Hard delete all tokens for this user (logout all devices)
  deleteAllUserTokens: (userId: string) => {
    return prisma.refreshToken.deleteMany({
      where: { userId },
    });
  },

};

export {
  AuthRepository
}