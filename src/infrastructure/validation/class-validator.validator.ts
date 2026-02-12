import { injectable } from 'inversify';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import type { IValidator } from '../../application/validation/validator.interface.js';
import { ValidationException } from '../../application/exception/validation.exception.js';

@injectable()
export class ClassValidatorValidator implements IValidator {
  async validate<T extends object>(dtoClass: new () => T, body: unknown): Promise<T> {
    const dto = plainToInstance(dtoClass, body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const messages = errors.flatMap((e) => Object.values(e.constraints ?? {}));
      throw new ValidationException(messages);
    }

    return dto;
  }
}
