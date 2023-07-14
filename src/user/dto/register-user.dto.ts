import {
  IsEmail,
  IsIn,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  MaxLength,
  MinLength,
  NotContains,
} from 'class-validator';
import { UserStatusType } from '../types/user-status.type';

export class RegisterUserDto {
  @IsString()
  @MaxLength(100)
  @MinLength(1)
  firstName: string;

  @IsString()
  @MaxLength(100)
  @MinLength(1)
  lasttName: string;

  @IsOptional()
  @IsPhoneNumber()
  phone: number;

  @IsEmail()
  @MaxLength(300)
  @MinLength(5)
  email: string;

  @IsString()
  @Length(8, 100)
  @NotContains(' ')
  password: string;

  @IsOptional()
  @IsString({ each: true })
  roles: string[];

  @IsOptional()
  @IsIn(Object.values(UserStatusType))
  status: UserStatusType;
}
