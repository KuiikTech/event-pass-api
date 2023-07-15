import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'kuiik@email.com',
    description: 'email of user',
  })
  @IsEmail()
  @MaxLength(300)
  @MinLength(5)
  email: string;

  @ApiProperty({
    example: 'dummy123*',
    description: 'password of user',
  })
  @IsString()
  @Length(8, 100)
  password: string;
}
