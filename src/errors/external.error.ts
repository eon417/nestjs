import { HttpException, HttpStatus } from '@nestjs/common';

export class ExternalAPiError extends HttpException {
  constructor(msg?: string) {
    super(msg || 'Unexpected error from external API', HttpStatus.BAD_GATEWAY);
  }
}
