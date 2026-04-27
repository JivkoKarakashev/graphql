import { UserRepository } from './user.repository';

export const UserService = {
  async getUsers() {
    return UserRepository.findAll();
  },
};