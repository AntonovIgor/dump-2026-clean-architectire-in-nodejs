import type { HttpRequest } from './request.js';
import type { HttpResponse } from './response.js';

export type RouteHandler = (req: HttpRequest, res: HttpResponse) => Promise<void>;

interface Route {
  method: string;
  segments: string[];
  handler: RouteHandler;
}

export class Router {
  private routes: Route[] = [];

  addRoute(method: string, path: string, handler: RouteHandler): void {
    const segments = path.split('/').filter(Boolean);
    this.routes.push({ method: method.toUpperCase(), segments, handler });
  }

  match(method: string, url: string): { handler: RouteHandler; params: Record<string, string> } | null {
    const { pathname } = new URL(url, 'http://localhost');
    const urlSegments = pathname.split('/').filter(Boolean);

    for (const route of this.routes) {
      if (route.method !== method.toUpperCase()) {
        continue;
      }
      
      if (route.segments.length !== urlSegments.length) {
        continue;
      } 

      const params: Record<string, string> = {};
      let matched = true;

      for (let i = 0; i < route.segments.length; i++) {
        const routeSeg = route.segments[i];
        const urlSeg = urlSegments[i];

        if (routeSeg.startsWith(':')) {
          params[routeSeg.slice(1)] = decodeURIComponent(urlSeg);
        } else if (routeSeg !== urlSeg) {
          matched = false;
          break;
        }
      }

      if (matched) {
        return { handler: route.handler, params };
      }
    }

    return null;
  }
}
