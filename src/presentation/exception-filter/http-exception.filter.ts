import { injectable } from 'inversify';

import { AbstractExceptionFilter } from '../../framework/exception-filter.abstract.js';
import { HttpException } from '../../framework/http-exception.js';
import type { HttpRequest } from '../../framework/request.js';
import type { HttpResponse } from '../../framework/response.js';

@injectable()
export class HttpExceptionFilter extends AbstractExceptionFilter {
  canHandle(error: Error): boolean {
    return error instanceof HttpException;
  }

  catch(error: Error, _req: HttpRequest, res: HttpResponse): void {
    const httpError = error as HttpException;
    res.status(httpError.statusCode).json({ error: httpError.message });
  }
}
