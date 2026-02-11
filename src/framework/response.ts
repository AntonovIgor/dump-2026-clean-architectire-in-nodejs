import type { ServerResponse } from 'node:http';

export class HttpResponse {
  private statusCode = 200;

  constructor(private readonly raw: ServerResponse) {}

  status(code: number): this {
    this.statusCode = code;
    return this;
  }

  json(data: unknown): void {
    this.raw.writeHead(this.statusCode, { 'Content-Type': 'application/json' });
    this.raw.end(JSON.stringify(data));
  }

  send(text: string): void {
    this.raw.writeHead(this.statusCode, { 'Content-Type': 'text/plain' });
    this.raw.end(text);
  }
}
