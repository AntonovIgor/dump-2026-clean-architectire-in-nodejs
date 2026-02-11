import type { HttpRequest } from './request.js';
import type { HttpResponse } from './response.js';

export type NextFunction = () => Promise<void>;

export interface IMiddleware {
  handle(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void>;
}

export async function runMiddlewarePipeline(
  middlewares: IMiddleware[],
  req: HttpRequest,
  res: HttpResponse,
  finalHandler: () => Promise<void>,
): Promise<void> {
  let index = 0;

  const next = async (): Promise<void> => {
    if (index < middlewares.length) {
      const middleware = middlewares[index++];
      await middleware.handle(req, res, next);
    } else {
      await finalHandler();
    }
  };

  await next();
}
