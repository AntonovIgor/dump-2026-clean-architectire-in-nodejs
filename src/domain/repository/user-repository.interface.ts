import type { User } from '../entity/user.entity.js';

export interface IUserRepository {
  create(user: Omit<User, 'id'>): User;
  findByEmail(email: string): User | null;
  findAll(): User[];
}
