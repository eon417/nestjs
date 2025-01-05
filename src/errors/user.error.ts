import { HttpException, HttpStatus } from '@nestjs/common';

export class UserEmailNotFoundError extends HttpException {
  constructor(email: string) {
    super(`User with email "${email}" does not exist`, HttpStatus.NOT_FOUND);
  }
}

export class UserIdNotFoundError extends HttpException {
  constructor(id: string) {
    super(`User with ID "${id}" does not exist`, HttpStatus.NOT_FOUND);
  }
}

export class UserEmailDuplicateError extends HttpException {
  constructor(email: string) {
    super(`User with email "${email}" is already used`, HttpStatus.NOT_FOUND);
  }
}
