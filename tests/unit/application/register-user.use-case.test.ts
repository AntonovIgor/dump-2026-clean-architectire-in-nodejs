import 'reflect-metadata';

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { RegisterUserUseCase } from '../../../src/application/use-case/register-user.use-case.js';
import type { RegisterUserRequest } from '../../../src/application/request/register-user.request.js';
import { UserService } from '../../../src/domain/service/user.service.js';
import { User } from '../../../src/domain/entity/user.entity.js';
import type { IUserRepository } from '../../../src/domain/repository/user-repository.interface.js';
import type { IPasswordHasher } from '../../../src/domain/service/password-hasher.interface.js';
import { UserAlreadyExistsException } from '../../../src/domain/exception/user-already-exists.exception.js';

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

function createRequest(overrides: Partial<RegisterUserRequest> = {}): RegisterUserRequest {
  return {
    email: overrides.email ?? 'test@example.com',
    firstName: overrides.firstName ?? 'John',
    lastName: overrides.lastName ?? 'Doe',
    dateOfBirth: overrides.dateOfBirth ?? '1990-01-15',
    password: overrides.password ?? 'secret123',
  };
}

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;

  beforeEach(() => {
    const repository = createMockRepository();
    const hasher = createMockHasher();
    const userService = new UserService(repository, hasher);
    useCase = new RegisterUserUseCase(userService);
  });

  it('should register user and return response without password', async () => {
    const result = await useCase.execute(createRequest());

    assert.equal(result.id, 1);
    assert.equal(result.email, 'test@example.com');
    assert.equal(result.firstName, 'John');
    assert.equal(result.lastName, 'Doe');
    assert.equal(result.dateOfBirth, '1990-01-15');
    assert.equal((result as Record<string, unknown>)['password'], undefined);
  });

  it('should throw UserAlreadyExistsException for duplicate email', async () => {
    await useCase.execute(createRequest());

    await assert.rejects(
      () => useCase.execute(createRequest({ firstName: 'Jane', dateOfBirth: '1991-02-20', password: 'secret456' })),
      (error: unknown) => {
        assert.ok(error instanceof UserAlreadyExistsException);
        assert.equal(error.email, 'test@example.com');
        return true;
      },
    );
  });
});
