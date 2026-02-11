import { Container } from 'inversify';
import { TYPES } from './shared/types.js';

import { SqliteDatabase } from './infrastructure/database/sqlite.database.js';
import { SqliteUserRepository } from './infrastructure/repository/sqlite-user.repository.js';
import { ScryptPasswordHasher } from './infrastructure/security/scrypt-password-hasher.js';
import { ClassValidatorValidator } from './infrastructure/validation/class-validator.validator.js';
import { UserService } from './domain/service/user.service.js';
import { RegisterUserUseCase } from './application/use-case/register-user.use-case.js';
import { LoginUserUseCase } from './application/use-case/login-user.use-case.js';
import { UserController } from './presentation/controller/user.controller.js';
import { HttpExceptionFilter } from './presentation/exception-filter/http-exception.filter.js';
import { ValidationExceptionFilter } from './presentation/exception-filter/validation-exception.filter.js';
import { UserAlreadyExistsExceptionFilter } from './presentation/exception-filter/user-already-exists-exception.filter.js';
import { InvalidCredentialsExceptionFilter } from './presentation/exception-filter/invalid-credentials-exception.filter.js';

export function createContainer(): Container {
  const container = new Container();

  // Infrastructure
  container.bind(TYPES.Database).to(SqliteDatabase).inSingletonScope();
  container.bind(TYPES.UserRepository).to(SqliteUserRepository).inSingletonScope();
  container.bind(TYPES.PasswordHasher).to(ScryptPasswordHasher).inSingletonScope();
  container.bind(TYPES.Validator).to(ClassValidatorValidator).inSingletonScope();

  // Domain
  container.bind(TYPES.UserService).to(UserService).inSingletonScope();

  // Application
  container.bind(TYPES.RegisterUserUseCase).to(RegisterUserUseCase).inSingletonScope();
  container.bind(TYPES.LoginUserUseCase).to(LoginUserUseCase).inSingletonScope();

  // Presentation
  container.bind(TYPES.UserController).to(UserController).inSingletonScope();
  container.bind(TYPES.HttpExceptionFilter).to(HttpExceptionFilter).inSingletonScope();
  container.bind(TYPES.ValidationExceptionFilter).to(ValidationExceptionFilter).inSingletonScope();
  container.bind(TYPES.UserAlreadyExistsExceptionFilter).to(UserAlreadyExistsExceptionFilter).inSingletonScope();
  container.bind(TYPES.InvalidCredentialsExceptionFilter).to(InvalidCredentialsExceptionFilter).inSingletonScope();

  return container;
}
