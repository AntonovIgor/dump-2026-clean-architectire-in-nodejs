import type { Router } from './router.js';

export abstract class AbstractController {
  abstract bindRoutes(router: Router): void;
}
