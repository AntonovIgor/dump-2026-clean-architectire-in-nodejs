import { inject, injectable } from 'inversify';

import { TYPES } from '../../infrastructure/ioc/types.js';
import { AbstractController } from '../../framework/controller.abstract.js';
import { RegisterUserDto } from '../dto/register-user.dto.js';
import { LoginUserDto } from '../dto/login-user.dto.js';
import type { IValidator } from '../../application/validation/validator.interface.js';
import type { Router } from '../../framework/router.js';
import type { HttpRequest } from '../../framework/request.js';
import type { HttpResponse } from '../../framework/response.js';
import type { RegisterUserUseCase } from '../../application/use-case/register-user.use-case.js';
import type { LoginUserUseCase } from '../../application/use-case/login-user.use-case.js';
import { UserResponseDto } from '../dto/user-response.dto.js';

@injectable()
export class UserController extends AbstractController {
  constructor(
    @inject(TYPES.RegisterUserUseCase) private readonly registerUseCase: RegisterUserUseCase,
    @inject(TYPES.LoginUserUseCase) private readonly loginUseCase: LoginUserUseCase,
    @inject(TYPES.Validator) private readonly validator: IValidator,
  ) {
    super();
  }

  bindRoutes(router: Router): void {
    router.addRoute('POST', '/register', this.register.bind(this));
    router.addRoute('POST', '/login', this.login.bind(this));
  }

  private async register(req: HttpRequest, res: HttpResponse): Promise<void> {
    const dto = await this.validator.validate(RegisterUserDto, req.body);
    const result = await this.registerUseCase.execute({
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      dateOfBirth: dto.dateOfBirth,
      password: dto.password,
    });
    res.status(201).json(UserResponseDto.fromResponse(result));
  }

  private async login(req: HttpRequest, res: HttpResponse): Promise<void> {
    const dto = await this.validator.validate(LoginUserDto, req.body);
    const result = await this.loginUseCase.execute({
      email: dto.email,
      password: dto.password,
    });
    res.status(200).json(result.map(UserResponseDto.fromResponse));
  }
}
