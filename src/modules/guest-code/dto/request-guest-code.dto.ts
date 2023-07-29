import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { GuestCodeStatusType } from '../types/guest-code-status.type';

export class RequestGuestCodeDto {
  @ApiProperty({
    example: '64b74abdb8d0fb6b13b4f299',
    description: 'event id to link code registration',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsMongoId()
  readonly eventId?: string;

  @ApiProperty({
    example: '64b74abdb8d0fb6b13b4f299',
    description: 'guest id to link code registration',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsMongoId()
  readonly guestId?: string;

  @ApiProperty({
    example: '64b74abdb8d0fb6b13b4f299',
    description: 'code id to link code registration',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsMongoId()
  readonly codeId?: string;

  @ApiProperty({
    example: 50,
    description: 'number of codes given to the guest',
    default: 0,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  readonly initialAmount?: number;

  @ApiProperty({
    example: 50,
    description: 'number of codes given to the guest',
    default: 0,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  readonly count?: number;

  @ApiProperty({
    example: GuestCodeStatusType.ACTIVE,
    description: `status of the GuestCode: ${Object.values(
      GuestCodeStatusType,
    ).join('||')}`,
    default: GuestCodeStatusType.ACTIVE,
  })
  @IsOptional()
  @IsIn(Object.values(GuestCodeStatusType))
  readonly status?: GuestCodeStatusType;
}
