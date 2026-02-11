import type { HttpRequest } from './request.js';
import type { HttpResponse } from './response.js';

export abstract class AbstractExceptionFilter {
  abstract canHandle(error: Error): boolean;
  abstract catch(error: Error, req: HttpRequest, res: HttpResponse): void;
}
