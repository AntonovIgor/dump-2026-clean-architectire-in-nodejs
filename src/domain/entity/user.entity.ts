export class User {
  constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly dateOfBirth: string,
    public readonly password: string,
  ) {}
}
