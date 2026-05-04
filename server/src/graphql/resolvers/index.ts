import { authResolvers } from '../../modules/auth/auth.resolver';
import { userResolvers } from '../../modules/user/user.resolver';

const resolversArray = [userResolvers, authResolvers];

const mergeResolvers = (key: 'Query' | 'Mutation') => Object.assign({}, ...resolversArray.map(r => r[key] ?? {}));

export const resolvers = {
  Query: mergeResolvers('Query'),
  Mutation: mergeResolvers('Mutation')
};