import { userTypeDefs } from '../../modules/user/user.types';

export const typeDefs = `#graphql
  type Query
  type Mutation

  ${userTypeDefs}
`;