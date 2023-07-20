import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

import { OrderByTransform } from 'src/libs/application/transforms/order-by.transform';
import { OrderBy } from 'src/libs/ddd/query.base';

export class PaginatedQueryWithSearchDto {
  @ApiPropertyOptional({
    example: 10,
    description: 'Specifies a limit of returned records',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(99999)
  @Type(() => Number)
  readonly limit?: number;

  @ApiPropertyOptional({
    example: 0,
    description: 'Page number',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(99999)
  @Type(() => Number)
  readonly page?: number;

  @ApiPropertyOptional({
    type: 'object',
    example: { name: 'asc', createdAt: 'desc' },
    description: 'Order query',
    required: false,
  })
  @IsOptional()
  @Transform((params) => OrderByTransform(params))
  readonly orderBy?: OrderBy;

  @ApiPropertyOptional({
    example: 'kuiik',
    description: 'Value to filter the search',
  })
  @IsOptional()
  readonly search?: string;
}
