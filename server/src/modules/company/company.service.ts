import { CompanyRepository } from './company.repository';
import { CreateCompanyInput, SearchCompanyInput, UpdateCompanyInput } from './company.schema';
import { NotFoundError, UnauthorizedError } from '../../errors';

export const CompanyService = {
  async getById(id: string) {
    const company = await CompanyRepository.findById(id);
    if (!company) {
      throw new NotFoundError('Company not found!');
    }
    return company;
  },

  async getByOwner(ownerId: string) {
    return CompanyRepository.findByOwner(ownerId);
  },

  async search(input: SearchCompanyInput) {
    const { query, page, limit } = input;
    const [companies, total] = await CompanyRepository.search(
      query ?? '',
      page,
      limit
    );

    return {
      companies,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
    };
  },

  async create(ownerId: string, input: CreateCompanyInput) {
    return CompanyRepository.create(ownerId, input);
  },

  async update(id: string, userId: string, input: UpdateCompanyInput) {
    const company = await CompanyRepository.findById(id);
    if (!company) {
      throw new NotFoundError('Company not found!');
    }
    if (company.ownerId !== userId) {
      throw new UnauthorizedError('You are not the owner of this company!');
    }
    return CompanyRepository.update(id, input);
  },

  async delete(id: string, userId: string) {
    const company = await CompanyRepository.findById(id);
    if (!company) {
      throw new NotFoundError('Company not found!');
    }
    if (company.ownerId !== userId) {
      throw new UnauthorizedError('You are not the owner of this company!');
    }
    await CompanyRepository.delete(id);
    return true;
  },
};