// @ts-expect-error — node:sqlite экспериментален в Node.js 24
import { DatabaseSync } from 'node:sqlite';
import { injectable } from 'inversify';

@injectable()
export class SqliteDatabase {
  private readonly db: InstanceType<typeof DatabaseSync>;

  constructor() {
    this.db = new DatabaseSync(':memory:');
    this.init();
  }

  private init(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        date_of_birth TEXT NOT NULL,
        password TEXT NOT NULL
      ) STRICT
    `);
  }

  prepare(sql: string) {
    return this.db.prepare(sql);
  }
}
