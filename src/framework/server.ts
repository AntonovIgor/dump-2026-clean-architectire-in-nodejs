import { createServer, type Server } from 'node:http';

import { HttpRequest } from './request.js';
import { HttpResponse } from './response.js';
import { Router } from './router.js';
import { HttpException } from './http-exception.js';
import type { IMiddleware } from './middleware.js';
import { runMiddlewarePipeline } from './middleware.js';
import type { AbstractController } from './controller.abstract.js';
import type { AbstractExceptionFilter } from './exception-filter.abstract.js';

export class HttpServer {
  private readonly server: Server;
  private readonly router = new Router();
  private readonly middlewares: IMiddleware[] = [];
  private readonly exceptionFilters: AbstractExceptionFilter[] = [];

  constructor() {
    this.server = createServer((rawReq, rawRes) => {
      this.handleRequest(new HttpRequest(rawReq), new HttpResponse(rawRes));
    });
  }

  useMiddleware(middleware: IMiddleware): void {
    this.middlewares.push(middleware);
  }

  useController(controller: AbstractController): void {
    controller.bindRoutes(this.router);
  }

  useExceptionFilter(filter: AbstractExceptionFilter): void {
    this.exceptionFilters.push(filter);
  }

  listen(port: number, callback?: () => void): Server {
    return this.server.listen(port, callback);
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.close((err) => (err ? reject(err) : resolve()));
    });
  }

  getRouter(): Router {
    return this.router;
  }

  private async handleRequest(req: HttpRequest, res: HttpResponse): Promise<void> {
    try {
      await runMiddlewarePipeline(this.middlewares, req, res, async () => {
        const matched = this.router.match(req.method, req.url);

        if (!matched) {
          throw new HttpException(404, 'Not Found');
        }

        req.params = matched.params;
        await matched.handler(req, res);
      });
    } catch (error) {
      this.handleError(error as Error, req, res);
    }
  }

  private handleError(error: Error, req: HttpRequest, res: HttpResponse): void {
    for (const filter of this.exceptionFilters) {
      if (filter.canHandle(error)) {
        filter.catch(error, req, res);
        return;
      }
    }

    // Fallback: 500 Internal Server Error
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
