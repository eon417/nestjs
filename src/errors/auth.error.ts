import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthenticationError extends HttpException {
  constructor() {
    super('Your email or password is incorrect', HttpStatus.UNAUTHORIZED);
  }
}

export class PasswordAuthenticationError extends HttpException {
  constructor() {
    super('Your password is incorrect', HttpStatus.UNAUTHORIZED);
  }
}
