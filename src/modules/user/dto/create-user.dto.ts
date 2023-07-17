import {
  IsArray,
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
import { UserStatusType } from '../types/user-status.type';
import { ApiProperty } from '@nestjs/swagger';

import { RolesType } from 'src/modules/auth/types/roles.types';

export class CreateUserDto {
  @ApiProperty({
    example: 'Kuiik',
    description: 'first name of the user',
  })
  @IsString()
  @MaxLength(100)
  @MinLength(1)
  firstName: string;

  @ApiProperty({
    example: 'Tec',
    description: 'last name of the user',
  })
  @IsString()
  @MaxLength(100)
  @MinLength(1)
  lastName: string;

  @ApiProperty({
    example: '+51 (123) 456 7899',
    description: 'phone number of the user',
    required: false,
  })
  @IsOptional()
  @Matches(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/)
  phone?: number;

  @ApiProperty({
    example: 'kuiik@email.com',
    description: 'email of the user',
  })
  @IsEmail()
  @MaxLength(300)
  @MinLength(5)
  email: string;

  @ApiProperty({
    example: 'dummy123*',
    description: 'password of the user',
  })
  @IsOptional()
  @IsString()
  @Length(8, 100)
  @NotContains(' ')
  password: string;

  @ApiProperty({
    example: `['${RolesType.EDITOR}','${RolesType.SUPERVISOR}']`,
    description: `roles list of the user: ${Object.values(RolesType)}`,
    default: [RolesType.GUEST],
  })
  @IsOptional()
  @IsArray()
  roles?: string[];

  @ApiProperty({
    example: UserStatusType.ACTIVE,
    description: `status of the user: ${Object.values(UserStatusType).join(
      '||',
    )}`,
    default: UserStatusType.ACTIVE,
  })
  @IsOptional()
  @IsIn(Object.values(UserStatusType))
  status?: UserStatusType;
}
