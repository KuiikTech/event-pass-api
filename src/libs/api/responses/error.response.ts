import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiProperty({ example: 400, description: 'http code of error' })
  readonly statusCode: number;

  @ApiProperty({
    example: [
      'password must be longer than or equal to 8 characters',
      'password must be a string',
    ],
    description: 'error message || messages[]',
  })
  readonly message: string | string[];

  @ApiProperty({ example: 'Bad Request', description: 'error message' })
  readonly error: string;

  constructor(body: ErrorResponse) {
    this.statusCode = body.statusCode;
    this.message = body.message;
    this.error = body.error;
  }
}
