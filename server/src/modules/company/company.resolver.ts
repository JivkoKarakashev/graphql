import { AppContext } from '../../graphql/context';
import { UnauthorizedError } from '../../errors';
import { CompanyService } from './company.service';
import { createCompanySchema, searchCompanySchema, updateCompanySchema } from './company.schema';
import { validate } from '../../graphql/validate';

export const companyResolvers = {
  Query: {
    company: async (_: unknown, args: { id: string }, ctx: AppContext) => {
      return CompanyService.getById(args.id);
    },

    myCompanies: async (_: unknown, __: unknown, ctx: AppContext) => {
      if (!ctx.user) {
        throw new UnauthorizedError('Not authenticated!');
      }
      return CompanyService.getByOwner(ctx.user.userId);
    },

    searchCompanies: async (
      _: unknown,
      args: { input: { query?: string, page?: number, limit?: number } },
      _ctx: AppContext
    ) => {
      const input = validate(searchCompanySchema, args.input);
      return CompanyService.search(input);
    },
  },

  Mutation: {
    createCompany: async (
      _: unknown,
      args: { input: { name: string, description: string, logo?: string, website?: string } },
      ctx: AppContext
    ) => {
      if (!ctx.user) {
        throw new UnauthorizedError('Not authenticated!');
      }
      const input = validate(createCompanySchema, args.input);
      return CompanyService.create(ctx.user.userId, input);
    },

    updateCompany: async (
      _: unknown,
      args: { id: string, input: { name?: string, description?: string, logo?: string, website?: string } },
      ctx: AppContext
    ) => {
      if (!ctx.user) {
        throw new UnauthorizedError('Not authenticated!');
      }
      const input = validate(updateCompanySchema, args.input);
      return CompanyService.update(args.id, ctx.user.userId, input);
    },

    deleteCompany: async (
      _: unknown,
      args: { id: string },
      ctx: AppContext
    ) => {
      if (!ctx.user) {
        throw new UnauthorizedError('Not authenticated!');
      }
      return CompanyService.delete(args.id, ctx.user.userId);
    },
  },
};