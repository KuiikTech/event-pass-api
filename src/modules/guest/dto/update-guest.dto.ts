import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
  NotContains,
} from 'class-validator';

export class UpdateGuestDto {
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
    example: '+51 (123) 456 7899',
    description: 'phone number of the user',
    required: false,
  })
  @IsOptional()
  @Matches(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/)
  phone?: string;

  @ApiProperty({
    example: 'kuiik@email.com',
    description: 'email of the user',
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(300)
  @MinLength(5)
  email?: string;

  @ApiProperty({
    example: 'dummy123*',
    description: 'password of the user',
  })
  @IsOptional()
  @IsString()
  @Length(8, 100)
  @NotContains(' ')
  password?: string;

  @ApiProperty({
    example: '1234567890',
    description: 'document number (nit) of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  documentNumber?: string;
}
