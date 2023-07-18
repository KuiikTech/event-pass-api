import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({
    example: 'Kuiik Party',
    description: 'name of the event',
  })
  @IsString()
  @MaxLength(300)
  @MinLength(1)
  name: string;

  @ApiProperty({
    example: 'Super Crazy Party by Kuiik',
    description: 'description of the event',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    example: 'Calle 0 #0-00, beautiful villa',
    description: 'address of the event',
  })
  @IsString()
  @IsOptional()
  @MaxLength(300)
  address?: string;

  @ApiProperty({
    example: 'Pamplona',
    description: 'city of the event',
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  city?: string;

  @ApiProperty({
    example: '2023-07-18T03:30:12.819+00:00',
    description: 'initial date of the event',
  })
  @IsNotEmpty()
  @IsDate()
  initialDate: Date;

  @ApiProperty({
    example: '2023-07-18T03:30:12.819+00:00',
    description: 'final date of the event',
  })
  @IsNotEmpty()
  @IsDate()
  finalDate: Date;

  @ApiProperty({
    example: 'no idea',
    description: 'pendiente pordefinir',
  })
  @IsOptional()
  @IsString()
  host?: string;

  @ApiProperty({
    example: '["leader", "follower"]',
    description: 'custom roles for event guests',
  })
  @IsOptional()
  @ArrayNotEmpty({ message: 'At least one guest role must be specified.' })
  @ArrayMaxSize(100, { message: 'Guest role cannot exceed 100 characters.' })
  @IsString({ each: true })
  guestRoles?: string[];
}
