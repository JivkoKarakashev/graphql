import { userTypeDefs } from '../../modules/user/user.types';
import { authTypeDefs } from '../../modules/auth/auth.types';
import { companyTypeDefs } from '../../modules/company/company.types';

export const typeDefs = `#graphql
  type Query
  type Mutation

  ${userTypeDefs}
  ${authTypeDefs}
  ${companyTypeDefs}
`;