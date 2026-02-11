import type { IncomingMessage } from 'node:http';

export class HttpRequest {
  public body: unknown = undefined;
  public params: Record<string, string> = {};

  constructor(private readonly raw: IncomingMessage) {}

  get method(): string {
    return this.raw.method ?? 'GET';
  }

  get url(): string {
    return this.raw.url ?? '/';
  }

  get headers(): IncomingMessage['headers'] {
    return this.raw.headers;
  }

  get rawRequest(): IncomingMessage {
    return this.raw;
  }
}
