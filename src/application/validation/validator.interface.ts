export interface IValidator {
  validate<T extends object>(dtoClass: new () => T, body: unknown): Promise<T>;
}
