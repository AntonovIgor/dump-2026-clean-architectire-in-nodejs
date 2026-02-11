import { inject, injectable } from 'inversify';

import { TYPES } from '../../infrastructure/ioc/types.js';
import type { RegisterUserRequest } from '../request/register-user.request.js';
import { UserResponse } from '../response/user.response.js';
import type { UserService } from '../../domain/service/user.service.js';

@injectable()
export class RegisterUserUseCase {
  constructor(
    @inject(TYPES.UserService) private readonly userService: UserService,
  ) {}

  async execute(request: RegisterUserRequest): Promise<UserResponse> {
    const user = await this.userService.register({
      email: request.email,
      firstName: request.firstName,
      lastName: request.lastName,
      dateOfBirth: request.dateOfBirth,
      password: request.password,
    });

    return UserResponse.fromEntity(user);
  }
}
