import type { UserResponse } from '../../application/response/user.response.js';

export class UserResponseDto {
  id!: number;
  email!: string;
  firstName!: string;
  lastName!: string;
  dateOfBirth!: string;

  static fromResponse(response: UserResponse): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = response.id;
    dto.email = response.email;
    dto.firstName = response.firstName;
    dto.lastName = response.lastName;
    dto.dateOfBirth = response.dateOfBirth;
    return dto;
  }
}
