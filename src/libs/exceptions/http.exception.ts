import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomValidationException extends HttpException {
  constructor(errors: string[], httpStatus: HttpStatus) {
    super(errors, httpStatus);
  }
}
