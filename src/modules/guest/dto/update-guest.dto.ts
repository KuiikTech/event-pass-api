import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
  NotContains,
} from 'class-validator';

import { GuestStatusType } from '../types/guest-status.type';

export class UpdateGuestDto {
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
    example: '+51 (123) 456 7899',
    description: 'phone number of the user',
    required: false,
  })
  @IsOptional()
  @Matches(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/)
  readonly phone?: string;

  @ApiProperty({
    example: 'kuiik@email.com',
    description: 'email of the user',
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(300)
  @MinLength(5)
  readonly email?: string;

  @ApiProperty({
    example: 'dummy123*',
    description: 'password of the user',
  })
  @IsOptional()
  @IsString()
  @Length(8, 100)
  @NotContains(' ')
  readonly password?: string;

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
