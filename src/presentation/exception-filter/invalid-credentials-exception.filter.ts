import { injectable } from 'inversify';

import { AbstractExceptionFilter } from '../../framework/exception-filter.abstract.js';
import { InvalidCredentialsException } from '../../domain/exception/invalid-credentials.exception.js';
import type { HttpRequest } from '../../framework/request.js';
import type { HttpResponse } from '../../framework/response.js';

@injectable()
export class InvalidCredentialsExceptionFilter extends AbstractExceptionFilter {
  canHandle(error: Error): boolean {
    return error instanceof InvalidCredentialsException;
  }

  catch(error: Error, _req: HttpRequest, res: HttpResponse): void {
    res.status(401).json({ error: error.message });
  }
}
