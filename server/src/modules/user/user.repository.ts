import { prisma } from '../../config/db';

export const UserRepository = {
  findAll: () => prisma.user.findMany(),
};