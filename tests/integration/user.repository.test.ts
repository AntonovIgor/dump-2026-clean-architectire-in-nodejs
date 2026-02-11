import 'reflect-metadata';

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { SqliteDatabase } from '../../src/infrastructure/database/sqlite.database.js';
import { SqliteUserRepository } from '../../src/infrastructure/repository/sqlite-user.repository.js';

describe('SqliteUserRepository', () => {
  let repository: SqliteUserRepository;

  beforeEach(() => {
    const db = new SqliteDatabase();
    repository = new SqliteUserRepository(db);
  });

  it('should create a user and return it with id', () => {
    const user = repository.create({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-15',
      password: 'hashedpassword',
    });

    assert.equal(user.id, 1);
    assert.equal(user.email, 'test@example.com');
    assert.equal(user.firstName, 'John');
    assert.equal(user.lastName, 'Doe');
    assert.equal(user.dateOfBirth, '1990-01-15');
    assert.equal(user.password, 'hashedpassword');
  });

  it('should find user by email', () => {
    repository.create({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-15',
      password: 'hashedpassword',
    });

    const found = repository.findByEmail('test@example.com');
    assert.ok(found);
    assert.equal(found.email, 'test@example.com');
  });

  it('should return null for non-existing email', () => {
    const found = repository.findByEmail('unknown@example.com');
    assert.equal(found, null);
  });

  it('should find all users', () => {
    repository.create({
      email: 'user1@example.com',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-15',
      password: 'hash1',
    });
    repository.create({
      email: 'user2@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: '1992-05-20',
      password: 'hash2',
    });

    const users = repository.findAll();
    assert.equal(users.length, 2);
  });

  it('should auto-increment ids', () => {
    const u1 = repository.create({
      email: 'a@example.com',
      firstName: 'A',
      lastName: 'A',
      dateOfBirth: '2000-01-01',
      password: 'p',
    });
    const u2 = repository.create({
      email: 'b@example.com',
      firstName: 'B',
      lastName: 'B',
      dateOfBirth: '2000-01-01',
      password: 'p',
    });

    assert.equal(u1.id, 1);
    assert.equal(u2.id, 2);
  });
});
