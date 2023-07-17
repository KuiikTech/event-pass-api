import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGuestDto {
  @ApiProperty({
    example: 'Guest',
    description: 'first name of the guest',
  })
  @IsString()
  @MaxLength(100)
  @MinLength(1)
  firstName: string;

  @ApiProperty({
    example: 'Event Pass',
    description: 'last name of the guest',
  })
  @IsString()
  @MaxLength(100)
  @MinLength(1)
  lastName: string;

  @ApiProperty({
    example: '+51 (123) 456 7899',
    description: 'phone number of the guest',
    required: false,
  })
  @Matches(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/)
  phone?: number;

  @ApiProperty({
    example: 'kuiik@email.com',
    description: 'email of the guest',
  })
  @IsEmail()
  @MaxLength(300)
  @MinLength(5)
  email: string;

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