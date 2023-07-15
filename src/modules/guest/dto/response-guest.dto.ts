import { ApiProperty } from '@nestjs/swagger';
import { EntityBaseResponse } from 'src/libs/api/responses/entity-base.response';

export class ResponseGuestDto extends EntityBaseResponse {
  @ApiProperty({
    example: 'Guest',
    description: 'first name of the guest',
  })
  firstName: string;

  @ApiProperty({
    example: 'Event Pass',
    description: 'last name of the guest',
  })
  lastName: string;

  @ApiProperty({
    example: '+51 (123) 456 7899',
    description: 'phone number of the guest',
    required: false,
  })
  phone: number;

  @ApiProperty({
    example: 'kuiik@email.com',
    description: 'email of the guest',
  })
  email: string;

  @ApiProperty({
    example: '1234567890',
    description: 'document number (nit) of the user',
    required: false,
  })
  documentNumber: string;
}
