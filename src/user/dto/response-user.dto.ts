import { ApiProperty } from '@nestjs/swagger';
import { EntityBaseResponse } from 'src/libs/api/responses/entity-base.response';
import { UserStatusType } from '../types/user-status.type';

export class ResponseUserDto extends EntityBaseResponse {
  @ApiProperty({
    example: 'Kuiik',
    description: 'first name of the user',
  })
  firstName: string;

  @ApiProperty({
    example: 'Tec',
    description: 'last name of the user',
  })
  lastName: string;

  @ApiProperty({
    example: '+57 000 000 0000',
    description: 'phone number of the user',
  })
  phone?: string;

  @ApiProperty({
    example: 'kuiik@email.com',
    description: 'email of the user',
  })
  email: string;

  @ApiProperty({
    example: '["editor","viewer"]',
    description: 'roles list of the user',
  })
  roles?: string[];

  @ApiProperty({
    example: 'active',
    description: 'status of the user',
  })
  status?: UserStatusType;
}
