import { injectable } from 'inversify';

import { AbstractExceptionFilter } from '../../framework/exception-filter.abstract.js';
import { UserAlreadyExistsException } from '../../domain/exception/user-already-exists.exception.js';
import type { HttpRequest } from '../../framework/request.js';
import type { HttpResponse } from '../../framework/response.js';

@injectable()
export class UserAlreadyExistsExceptionFilter extends AbstractExceptionFilter {
  canHandle(error: Error): boolean {
    return error instanceof UserAlreadyExistsException;
  }

  catch(error: Error, _req: HttpRequest, res: HttpResponse): void {
    res.status(409).json({ error: error.message });
  }
}
