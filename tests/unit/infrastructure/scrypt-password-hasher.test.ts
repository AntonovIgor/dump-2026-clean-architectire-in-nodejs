import 'reflect-metadata';

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { ScryptPasswordHasher } from '../../../src/infrastructure/security/scrypt-password-hasher.js';

describe('ScryptPasswordHasher', () => {
  const hasher = new ScryptPasswordHasher();

  it('should hash password and return salt:hash format', async () => {
    const hashed = await hasher.hash('secret123');
    assert.ok(hashed.includes(':'));

    const [salt, hash] = hashed.split(':');
    assert.equal(salt.length, 32);
    assert.equal(hash.length, 128)
  });

  it('should generate different hashes for same password (random salt)', async () => {
    const hash1 = await hasher.hash('secret123');
    const hash2 = await hasher.hash('secret123');
    assert.notEqual(hash1, hash2);
  });

  it('should compare correctly with valid password', async () => {
    const hashed = await hasher.hash('secret123');
    const isValid = await hasher.compare('secret123', hashed);
    assert.equal(isValid, true);
  });

  it('should compare correctly with invalid password', async () => {
    const hashed = await hasher.hash('secret123');
    const isValid = await hasher.compare('wrongpassword', hashed);
    assert.equal(isValid, false);
  });
});
