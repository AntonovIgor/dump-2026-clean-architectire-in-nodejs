import { injectable } from 'inversify';

import { AbstractExceptionFilter } from '../../framework/exception-filter.abstract.js';
import { ValidationException } from '../../application/exception/validation.exception.js';
import type { HttpRequest } from '../../framework/request.js';
import type { HttpResponse } from '../../framework/response.js';

@injectable()
export class ValidationExceptionFilter extends AbstractExceptionFilter {
  canHandle(error: Error): boolean {
    return error instanceof ValidationException;
  }

  catch(error: Error, _req: HttpRequest, res: HttpResponse): void {
    const validationError = error as ValidationException;
    res.status(422).json({ errors: validationError.errors });
  }
}
