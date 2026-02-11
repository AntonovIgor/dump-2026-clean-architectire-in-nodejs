import 'reflect-metadata';

import { createContainer } from './container.js';
import { TYPES } from './shared/types.js';
import { HttpServer } from './framework/server.js';
import { JsonBodyParserMiddleware } from './framework/json-body-parser.middleware.js';
import type { UserController } from './presentation/controller/user.controller.js';
import type { HttpExceptionFilter } from './presentation/exception-filter/http-exception.filter.js';
import type { ValidationExceptionFilter } from './presentation/exception-filter/validation-exception.filter.js';
import type { UserAlreadyExistsExceptionFilter } from './presentation/exception-filter/user-already-exists-exception.filter.js';
import type { InvalidCredentialsExceptionFilter } from './presentation/exception-filter/invalid-credentials-exception.filter.js';

const PORT = 3000;

const container = createContainer();

const server = new HttpServer();

// Middleware
server.useMiddleware(new JsonBodyParserMiddleware());

// Exception Filters (order matters — more specific first)
server.useExceptionFilter(container.get<ValidationExceptionFilter>(TYPES.ValidationExceptionFilter));
server.useExceptionFilter(container.get<UserAlreadyExistsExceptionFilter>(TYPES.UserAlreadyExistsExceptionFilter));
server.useExceptionFilter(container.get<InvalidCredentialsExceptionFilter>(TYPES.InvalidCredentialsExceptionFilter));
server.useExceptionFilter(container.get<HttpExceptionFilter>(TYPES.HttpExceptionFilter));

// Controllers
server.useController(container.get<UserController>(TYPES.UserController));

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export { server, container };
