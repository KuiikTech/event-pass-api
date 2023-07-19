import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EventStatusType } from '../types/event-status.type';

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
    example: '2023-01-31T12:00:00Z',
    description: 'initial date of the event, format ISO 8601',
  })
  @IsNotEmpty()
  @IsDateString()
  initialDate: Date;

  @ApiProperty({
    example: '2023-01-31T16:30:00Z',
    description: 'final date of the event',
  })
  @IsNotEmpty()
  @IsDateString()
  finalDate: Date;

  @ApiProperty({
    example: 'Kuiik Tec',
    description: 'event organizer',
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

  @ApiProperty({
    example: EventStatusType.ACTIVE,
    description: `status of the event: ${Object.values(EventStatusType).join(
      '||',
    )}`,
    default: EventStatusType.ACTIVE,
  })
  @IsOptional()
  @IsIn(Object.values(EventStatusType))
  status?: EventStatusType;
}
