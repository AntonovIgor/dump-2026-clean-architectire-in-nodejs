import 'reflect-metadata';

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { UserService } from '../../../src/domain/service/user.service.js';
import type { IUserRepository } from '../../../src/domain/repository/user-repository.interface.js';
import type { IPasswordHasher } from '../../../src/domain/service/password-hasher.interface.js';
import { User } from '../../../src/domain/entity/user.entity.js';
import { UserAlreadyExistsException } from '../../../src/domain/exception/user-already-exists.exception.js';
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

describe('UserService', () => {
  let service: UserService;
  let repository: IUserRepository;
  let hasher: IPasswordHasher;

  beforeEach(() => {
    repository = createMockRepository();
    hasher = createMockHasher();
    service = new UserService(repository, hasher);
  });

  describe('register', () => {
    it('should register a new user with hashed password', async () => {
      const user = await service.register({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-15',
        password: 'secret123',
      });

      assert.equal(user.id, 1);
      assert.equal(user.email, 'test@example.com');
      assert.equal(user.firstName, 'John');
      assert.equal(user.password, 'hashed_secret123');
    });

    it('should reject registration with existing email', async () => {
      await service.register({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-15',
        password: 'secret123',
      });

      await assert.rejects(
        () =>
          service.register({
            email: 'test@example.com',
            firstName: 'Jane',
            lastName: 'Doe',
            dateOfBirth: '1991-02-20',
            password: 'secret456',
          }),
        (error: unknown) => {
          assert.ok(error instanceof UserAlreadyExistsException);
          assert.equal(error.email, 'test@example.com');
          return true;
        },
      );
    });
  });

  describe('login', () => {
    it('should return all users on valid credentials', async () => {
      await service.register({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-15',
        password: 'secret123',
      });

      const users = await service.login('test@example.com', 'secret123');
      assert.equal(users.length, 1);
      assert.equal(users[0].email, 'test@example.com');
    });

    it('should reject login with wrong email', async () => {
      await assert.rejects(
        () => service.login('unknown@example.com', 'secret123'),
        (error: unknown) => {
          assert.ok(error instanceof InvalidCredentialsException);
          return true;
        },
      );
    });

    it('should reject login with wrong password', async () => {
      await service.register({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-15',
        password: 'secret123',
      });

      await assert.rejects(
        () => service.login('test@example.com', 'wrongpassword'),
        (error: unknown) => {
          assert.ok(error instanceof InvalidCredentialsException);
          return true;
        },
      );
    });
  });
});
