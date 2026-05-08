import { z } from 'zod';

import { CompanySchema } from '../../generated/zod/schemas';

const createCompanySchema = CompanySchema
  .omit({ id: true, ownerId: true })
  .extend({
    name: z.string().min(2, 'Company name must be at least 2 characters long!').max(100, 'Company name must not exceed 100 characters long!'),
    description: z.string().min(10, 'Company description must be at least 10 characters long!'),
    logo: z.url('Company logo must be a valid URL!').nullish(),
    website: z.url('Cmpany website must be a valid URL!').nullish()
  });

const updateCompanySchema = createCompanySchema.partial();

const searchCompanySchema = z.object({
  query: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10)
});

type CreateCompanyInput = z.infer<typeof createCompanySchema>;
type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
type SearchCompanyInput = z.infer<typeof searchCompanySchema>;

export {
  createCompanySchema,
  updateCompanySchema,
  searchCompanySchema,
  type CreateCompanyInput,
  type UpdateCompanyInput,
  type SearchCompanyInput
}