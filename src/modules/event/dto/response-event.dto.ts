import { ApiProperty } from '@nestjs/swagger';
import { EntityBaseResponse } from 'src/libs/api/responses/entity-base.response';

export class ResponseEventDto extends EntityBaseResponse {
  @ApiProperty({
    example: 'Kuiik Party',
    description: 'name of the event',
  })
  name: string;

  @ApiProperty({
    example: 'Super Crazy Party by Kuiik',
    description: 'description of the event',
  })
  description?: string;

  @ApiProperty({
    example: 'Calle 0 #0-00, beautiful villa',
    description: 'address of the event',
  })
  address?: string;

  @ApiProperty({
    example: 'Pamplona',
    description: 'city of the event',
  })
  city?: string;

  @ApiProperty({
    example: '2023-07-18T03:30:12.819+00:00',
    description: 'initial date of the event',
  })
  initialDate: Date;

  @ApiProperty({
    example: '2023-07-18T03:30:12.819+00:00',
    description: 'final date of the event',
  })
  finalDate: Date;

  @ApiProperty({
    example: 'no idea',
    description: 'pendiente pordefinir',
  })
  host?: string;

  @ApiProperty({
    example: '["leader", "follower"]',
    description: 'custom roles for event guests',
  })
  guestRoles?: string[];
}
