import { ApiProperty } from '@nestjs/swagger';
import { GuestCodeStatusType } from '../types/guest-code-status.type';

export class ResponseGuestCodeDto {
  @ApiProperty({
    example: '64b74abdb8d0fb6b13b4f299',
    description: 'event id to link code registration',
  })
  readonly eventId: string;

  @ApiProperty({
    example: '64b74abdb8d0fb6b13b4f299',
    description: 'guest id to link code registration',
  })
  readonly guestId: string;

  @ApiProperty({
    example: '64b74abdb8d0fb6b13b4f299',
    description: 'code id to link code registration',
  })
  readonly codeId: string;

  @ApiProperty({
    example: 50,
    description: 'number of codes given to the guest',
    default: 0,
  })
  readonly initialAmount?: number;

  @ApiProperty({
    example: GuestCodeStatusType.ACTIVE,
    description: `status of the GuestCode: ${Object.values(
      GuestCodeStatusType,
    ).join('||')}`,
    default: GuestCodeStatusType.ACTIVE,
  })
  readonly status?: GuestCodeStatusType;
}
