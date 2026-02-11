import 'reflect-metadata';

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';

import { createContainer } from '../../src/container.js';
import { TYPES } from '../../src/shared/types.js';
import { HttpServer } from '../../src/framework/server.js';
import { JsonBodyParserMiddleware } from '../../src/framework/json-body-parser.middleware.js';
import type { UserController } from '../../src/presentation/controller/user.controller.js';
import type { HttpExceptionFilter } from '../../src/presentation/exception-filter/http-exception.filter.js';
import type { ValidationExceptionFilter } from '../../src/presentation/exception-filter/validation-exception.filter.js';
import type { UserAlreadyExistsExceptionFilter } from '../../src/presentation/exception-filter/user-already-exists-exception.filter.js';
import type { InvalidCredentialsExceptionFilter } from '../../src/presentation/exception-filter/invalid-credentials-exception.filter.js';

const PORT = 0;

describe('API E2E Tests', () => {
  let server: HttpServer;
  let baseUrl: string;

  before(async () => {
    const container = createContainer();
    server = new HttpServer();

    server.useMiddleware(new JsonBodyParserMiddleware());
    server.useExceptionFilter(container.get<ValidationExceptionFilter>(TYPES.ValidationExceptionFilter));
    server.useExceptionFilter(container.get<UserAlreadyExistsExceptionFilter>(TYPES.UserAlreadyExistsExceptionFilter));
    server.useExceptionFilter(container.get<InvalidCredentialsExceptionFilter>(TYPES.InvalidCredentialsExceptionFilter));
    server.useExceptionFilter(container.get<HttpExceptionFilter>(TYPES.HttpExceptionFilter));
    server.useController(container.get<UserController>(TYPES.UserController));

    const httpServer = server.listen(PORT);
    const address = httpServer.address();
    const port = typeof address === 'object' && address ? address.port : PORT;
    baseUrl = `http://localhost:${port}`;
  });

  after(async () => {
    await server.close();
  });

  async function post(path: string, body: unknown): Promise<{ status: number; data: unknown }> {
    const res = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return { status: res.status, data };
  }

  describe('POST /register', () => {
    it('should register a new user — 201', async () => {
      const { status, data } = await post('/register', {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-15',
        password: 'secret123',
      });

      assert.equal(status, 201);
      const user = data as Record<string, unknown>;
      assert.equal(user['email'], 'test@example.com');
      assert.equal(user['firstName'], 'John');
      assert.equal(user['password'], undefined);
    });

    it('should return 422 for invalid data', async () => {
      const { status, data } = await post('/register', {
        email: 'not-an-email',
        password: '12',
      });

      assert.equal(status, 422);
      const body = data as { errors: string[] };
      assert.ok(body.errors.length > 0);
    });

    it('should return 409 for duplicate email', async () => {
      const { status } = await post('/register', {
        email: 'test@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: '1992-05-20',
        password: 'secret456',
      });

      assert.equal(status, 409);
    });
  });

  describe('POST /login', () => {
    it('should login and return user list — 200', async () => {
      const { status, data } = await post('/login', {
        email: 'test@example.com',
        password: 'secret123',
      });

      assert.equal(status, 200);
      assert.ok(Array.isArray(data));
      const users = data as Record<string, unknown>[];
      assert.ok(users.length >= 1);
      assert.equal(users[0]['email'], 'test@example.com');
      assert.equal(users[0]['password'], undefined);
    });

    it('should return 422 for invalid data', async () => {
      const { status } = await post('/login', { email: 'bad', password: '1' });
      assert.equal(status, 422);
    });

    it('should return 401 for wrong credentials', async () => {
      const { status } = await post('/login', {
        email: 'test@example.com',
        password: 'wrongpassword',
      });
      assert.equal(status, 401);
    });
  });

  describe('Unknown routes', () => {
    it('should return 404 for unknown route', async () => {
      const { status } = await post('/unknown', {});
      assert.equal(status, 404);
    });
  });
});
