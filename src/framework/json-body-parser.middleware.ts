import type { IMiddleware, NextFunction } from './middleware.js';
import type { HttpRequest } from './request.js';
import type { HttpResponse } from './response.js';

export class JsonBodyParserMiddleware implements IMiddleware {
  async handle(req: HttpRequest, _res: HttpResponse, next: NextFunction): Promise<void> {
    if (req.headers['content-type']?.includes('application/json')) {
      const chunks: Buffer[] = [];

      for await (const chunk of req.rawRequest) {
        chunks.push(chunk as Buffer);
      }

      const raw = Buffer.concat(chunks).toString('utf-8');

      if (raw.length > 0) {
        req.body = JSON.parse(raw);
      }
    }

    await next();
  }
}
