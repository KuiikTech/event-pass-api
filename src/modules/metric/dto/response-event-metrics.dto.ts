import { ApiProperty } from '@nestjs/swagger';

export class ResponseTotalEventMetricsDto {
  @ApiProperty({
    description: 'Total count of upcoming events',
    type: Number,
  })
  upcomingCount: number;

  @ApiProperty({
    description: 'Total count of ongoing events',
    type: Number,
  })
  ongoingCount: number;

  @ApiProperty({
    description: 'Total count of completed events',
    type: Number,
  })
  completedCount: number;

  @ApiProperty({
    description: 'Event counts by city',
    type: Object,
    example: {
      'New York': 8,
      'Los Angeles': 12,
      'San Diego': 5,
    },
    additionalProperties: {
      type: 'number',
    },
  })
  byCity: { [city: string]: number };
}
