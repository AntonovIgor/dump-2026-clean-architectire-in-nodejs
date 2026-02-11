export const TYPES = {
  Validator: Symbol.for('Validator'),
  Database: Symbol.for('Database'),
  UserRepository: Symbol.for('UserRepository'),
  PasswordHasher: Symbol.for('PasswordHasher'),
  UserService: Symbol.for('UserService'),
  RegisterUserUseCase: Symbol.for('RegisterUserUseCase'),
  LoginUserUseCase: Symbol.for('LoginUserUseCase'),
  UserController: Symbol.for('UserController'),
  HttpExceptionFilter: Symbol.for('HttpExceptionFilter'),
  ValidationExceptionFilter: Symbol.for('ValidationExceptionFilter'),
  UserAlreadyExistsExceptionFilter: Symbol.for('UserAlreadyExistsExceptionFilter'),
  InvalidCredentialsExceptionFilter: Symbol.for('InvalidCredentialsExceptionFilter'),
};
