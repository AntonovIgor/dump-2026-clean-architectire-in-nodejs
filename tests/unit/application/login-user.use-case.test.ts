import 'reflect-metadata';

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { LoginUserUseCase } from '../../../src/application/use-case/login-user.use-case.js';
import { RegisterUserUseCase } from '../../../src/application/use-case/register-user.use-case.js';
import type { RegisterUserRequest } from '../../../src/application/request/register-user.request.js';
import type { LoginUserRequest } from '../../../src/application/request/login-user.request.js';
import { UserService } from '../../../src/domain/service/user.service.js';
import { User } from '../../../src/domain/entity/user.entity.js';
import type { IUserRepository } from '../../../src/domain/repository/user-repository.interface.js';
import type { IPasswordHasher } from '../../../src/domain/service/password-hasher.interface.js';
import { InvalidCredentialsException } from '../../../src/domain/exception/invalid-credentials.exception.js';

function createMockRepository(): IUserRepository {
  const users: User[] = [];
  return {
    create(data: Omit<User, 'id'>): User {
      const user = new User(users.length + 1, data.email, data.firstName, data.lastName, data.dateOfBirth, data.password);
      users.push(user);
      return user;
    },
    findByEmail(email: string): User | null {
      return users.find((u) => u.email === email) ?? null;
    },
    findAll(): User[] {
      return [...users];
    },
  };
}

function createMockHasher(): IPasswordHasher {
  return {
    async hash(password: string): Promise<string> {
      return `hashed_${password}`;
    },
    async compare(password: string, hashedPassword: string): Promise<boolean> {
      return hashedPassword === `hashed_${password}`;
    },
  };
}

function createRegisterRequest(): RegisterUserRequest {
  return {
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-15',
    password: 'secret123',
  };
}

function createLoginRequest(overrides: Partial<LoginUserRequest> = {}): LoginUserRequest {
  return {
    email: overrides.email ?? 'test@example.com',
    password: overrides.password ?? 'secret123',
  };
}

describe('LoginUserUseCase', () => {
  let loginUseCase: LoginUserUseCase;
  let registerUseCase: RegisterUserUseCase;

  beforeEach(() => {
    const repository = createMockRepository();
    const hasher = createMockHasher();
    const userService = new UserService(repository, hasher);
    loginUseCase = new LoginUserUseCase(userService);
    registerUseCase = new RegisterUserUseCase(userService);
  });

  it('should return list of users on valid login', async () => {
    await registerUseCase.execute(createRegisterRequest());

    const result = await loginUseCase.execute(createLoginRequest());

    assert.ok(Array.isArray(result));
    assert.equal(result.length, 1);
    assert.equal(result[0].email, 'test@example.com');
    assert.equal((result[0] as Record<string, unknown>)['password'], undefined);
  });

  it('should throw InvalidCredentialsException for invalid credentials', async () => {
    await registerUseCase.execute(createRegisterRequest());

    await assert.rejects(
      () => loginUseCase.execute(createLoginRequest({ password: 'wrongpassword' })),
      (error: unknown) => {
        assert.ok(error instanceof InvalidCredentialsException);
        assert.equal(error.message, 'Invalid credentials');
        return true;
      },
    );
  });
});
