import { inject, injectable } from 'inversify';

import { TYPES } from '../../infrastructure/ioc/types.js';
import type { LoginUserRequest } from '../request/login-user.request.js';
import { UserResponse } from '../response/user.response.js';
import type { UserService } from '../../domain/service/user.service.js';

@injectable()
export class LoginUserUseCase {
  constructor(
    @inject(TYPES.UserService) private readonly userService: UserService,
  ) {}

  async execute(request: LoginUserRequest): Promise<UserResponse[]> {
    const users = await this.userService.login(request.email, request.password);
    return users.map(UserResponse.fromEntity);
  }
}
