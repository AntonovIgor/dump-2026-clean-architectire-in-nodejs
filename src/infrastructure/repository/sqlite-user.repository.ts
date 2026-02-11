import { inject, injectable } from 'inversify';

import { TYPES } from '../ioc/types.js';
import { User } from '../../domain/entity/user.entity.js';
import type { IUserRepository } from '../../domain/repository/user-repository.interface.js';
import type { SqliteDatabase } from '../database/sqlite.database.js';

interface UserRow {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  password: string;
}

@injectable()
export class SqliteUserRepository implements IUserRepository {
  constructor(
    @inject(TYPES.Database) private readonly db: SqliteDatabase,
  ) {}

  create(user: Omit<User, 'id'>): User {
    const stmt = this.db.prepare(
      'INSERT INTO users (email, first_name, last_name, date_of_birth, password) VALUES (?, ?, ?, ?, ?)',
    );

    const result = stmt.run(
      user.email,
      user.firstName,
      user.lastName,
      user.dateOfBirth,
      user.password,
    ) as { lastInsertRowid: number };

    return new User(
      Number(result.lastInsertRowid),
      user.email,
      user.firstName,
      user.lastName,
      user.dateOfBirth,
      user.password,
    );
  }

  findByEmail(email: string): User | null {
    const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?');
    const row = stmt.get(email) as UserRow | undefined;

    if (!row) { 
      return null;
    }

    return this.mapRow(row);
  }

  findAll(): User[] {
    const stmt = this.db.prepare('SELECT * FROM users');
    const rows = stmt.all() as UserRow[];

    return rows.map((row) => this.mapRow(row));
  }

  private mapRow(row: UserRow): User {
    return new User(
      row.id,
      row.email,
      row.first_name,
      row.last_name,
      row.date_of_birth,
      row.password,
    );
  }
}
