import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { EventStatusType } from '../types/event-status.type';

export class RequestEventDto {
  @ApiProperty({
    example: 'Kuiik Party',
    description: 'name of the event',
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  @MinLength(1)
  name?: string;

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
  @IsOptional()
  @IsNotEmpty()
  @IsDate()
  initialDate?: Date;

  @ApiProperty({
    example: '2023-07-18T03:30:12.819+00:00',
    description: 'final date of the event',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsDate()
  finalDate?: Date;

  @ApiProperty({
    example: 'Kuiik Tec',
    description: 'event organizer',
  })
  @IsOptional()
  @IsString()
  host?: string;

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
