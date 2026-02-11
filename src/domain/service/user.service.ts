import { inject, injectable } from 'inversify';

import { TYPES } from '../../infrastructure/ioc/types.js';
import type { User } from '../entity/user.entity.js';
import type { IUserRepository } from '../repository/user-repository.interface.js';
import type { IPasswordHasher } from './password-hasher.interface.js';
import { UserAlreadyExistsException } from '../exception/user-already-exists.exception.js';
import { InvalidCredentialsException } from '../exception/invalid-credentials.exception.js';

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository,
    @inject(TYPES.PasswordHasher) private readonly passwordHasher: IPasswordHasher,
  ) {}

  async register(data: Omit<User, 'id' | 'password'> & { password: string }): Promise<User> {
    const existing = this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new UserAlreadyExistsException(data.email);
    }

    const hashedPassword = await this.passwordHasher.hash(data.password);

    return this.userRepository.create({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      password: hashedPassword,
    });
  }

  async login(email: string, password: string): Promise<User[]> {
    const user = this.userRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsException();
    }

    const isValid = await this.passwordHasher.compare(password, user.password);
    if (!isValid) {
      throw new InvalidCredentialsException();
    }

    return this.userRepository.findAll();
  }
}
