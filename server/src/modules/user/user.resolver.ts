import { UserService } from './user.service';

export const userResolvers = {
  Query: {
    users: async () => {
      return UserService.getUsers();
    },
  },
  Mutation: {},
};