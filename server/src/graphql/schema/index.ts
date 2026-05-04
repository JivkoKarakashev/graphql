import { userTypeDefs } from '../../modules/user/user.types';
import { authTypeDefs } from '../../modules/auth/auth.types';

export const typeDefs = `#graphql
  type Query
  type Mutation

  ${userTypeDefs}
  ${authTypeDefs}
`;