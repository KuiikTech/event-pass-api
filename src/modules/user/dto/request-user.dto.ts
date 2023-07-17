import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { UserStatusType } from '../types/user-status.type';

export class RequestUserDto {
  @ApiProperty({
    example: 'Kuiik',
    description: 'first name of the user',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @MinLength(1)
  firstName?: string;

  @ApiProperty({
    example: 'Tec',
    description: 'last name of the user',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @MinLength(1)
  lastName?: string;

  @ApiProperty({
    example: UserStatusType.ACTIVE,
    description: `status of the user: ${Object.values(UserStatusType).join(
      '||',
    )}`,
    default: UserStatusType.ACTIVE,
  })
  @IsOptional()
  @IsIn(Object.values(UserStatusType))
  readonly status?: string;
}
