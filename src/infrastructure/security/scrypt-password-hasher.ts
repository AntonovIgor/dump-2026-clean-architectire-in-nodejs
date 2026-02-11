import { injectable } from 'inversify';

import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

import type { IPasswordHasher } from '../../domain/service/password-hasher.interface.js';

@injectable()
export class ScryptPasswordHasher implements IPasswordHasher {
  private readonly keyLength = 64;

  async hash(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = await this.deriveKey(password, salt);
    return `${salt}:${derivedKey.toString('hex')}`;
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    const [salt, hash] = hashedPassword.split(':');
    const derivedKey = await this.deriveKey(password, salt);
    const hashBuffer = Buffer.from(hash, 'hex');
    return timingSafeEqual(derivedKey, hashBuffer);
  }

  private deriveKey(password: string, salt: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      scrypt(password, salt, this.keyLength, (err, key) => {
        if (err) {
          reject(err);
        } else {
          resolve(key);
        }
      });
    });
  }
}
