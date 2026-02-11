import type { User } from '../../domain/entity/user.entity.js';

export class UserResponse {
  id!: number;
  email!: string;
  firstName!: string;
  lastName!: string;
  dateOfBirth!: string;

  static fromEntity(user: User): UserResponse {
    const response = new UserResponse();
    response.id = user.id;
    response.email = user.email;
    response.firstName = user.firstName;
    response.lastName = user.lastName;
    response.dateOfBirth = user.dateOfBirth;
    return response;
  }
}
