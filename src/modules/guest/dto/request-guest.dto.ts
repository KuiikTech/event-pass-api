import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { GuestStatusType } from '../types/guest-status.type';

export class RequestGuestDto {
  @ApiProperty({
    example: 'Kuiik',
    description: 'first name of the user',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @MinLength(1)
  readonly firstName?: string;

  @ApiProperty({
    example: 'Tec',
    description: 'last name of the user',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @MinLength(1)
  readonly lastName?: string;

  @ApiProperty({
    example: '1234567890',
    description: 'document number (nit) of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  readonly documentNumber?: string;

  @ApiProperty({
    example: GuestStatusType.ACTIVE,
    description: `status of the guest: ${Object.values(GuestStatusType).join(
      '||',
    )}`,
    default: GuestStatusType.ACTIVE,
  })
  @IsOptional()
  @IsIn(Object.values(GuestStatusType))
  readonly status?: GuestStatusType;
}
