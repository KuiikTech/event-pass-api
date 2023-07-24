import { ApiProperty } from '@nestjs/swagger';

export class ResponseUpdateManyCodesDto {
  @ApiProperty({
    example: '10',
    description: 'numbers codes updated',
  })
  modifiedCount: number;
}
