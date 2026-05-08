import { prisma } from '../../config/db';
import { CreateCompanyInput, UpdateCompanyInput } from './company.schema';

export const CompanyRepository = {
  findById: (id: string) =>
    prisma.company.findUnique({
      where: { id },
      include: { owner: { select: { id: true, username: true, email: true } } },
    }),

  findByOwner: (ownerId: string) =>
    prisma.company.findMany({
      where: { ownerId },
      include: { owner: { select: { id: true, username: true, email: true } } },
      orderBy: { name: 'asc' },
    }),

  search: (query: string, page: number, limit: number) => {
    const where = query
      ? {
        OR: [
          { name: { contains: query, mode: 'insensitive' as const } },
          { description: { contains: query, mode: 'insensitive' as const } },
        ],
      }
      : {};

    return Promise.all([
      prisma.company.findMany({
        where,
        include: { owner: { select: { id: true, username: true, email: true } } },
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.company.count({ where }),
    ]);
  },

  create: (ownerId: string, data: CreateCompanyInput) =>
    prisma.company.create({
      data: { ...data, ownerId },
      include: { owner: { select: { id: true, username: true, email: true } } },
    }),

  update: (id: string, data: UpdateCompanyInput) =>
    prisma.company.update({
      where: { id },
      data,
      include: { owner: { select: { id: true, username: true, email: true } } },
    }),

  delete: (id: string) =>
    prisma.company.delete({ where: { id } }),
};