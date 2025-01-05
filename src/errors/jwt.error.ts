import { HttpException, HttpStatus } from '@nestjs/common';
export class AuthorizationNotFoundError extends HttpException {
  constructor() {
    super('Authorization token is missing', HttpStatus.UNAUTHORIZED);
  }
}

export class AuthorizationInvalidError extends HttpException {
  constructor() {
    super('Authorization token is invalid', HttpStatus.UNAUTHORIZED);
  }
}
