import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

import { OrderByTransform } from 'src/libs/application/transforms/order-by.transform';
import { OrderBy } from 'src/libs/ddd/query.base';

export class PaginatedQueryDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(99999)
  @Type(() => Number)
  @ApiPropertyOptional({
    example: 10,
    description: 'Specifies a limit of returned records',
    required: false,
  })
  readonly limit?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(99999)
  @Type(() => Number)
  @ApiPropertyOptional({
    example: 0,
    description: 'Page number',
    required: false,
  })
  readonly page?: number;

  @IsOptional()
  @Transform((params) => OrderByTransform(params))
  @ApiPropertyOptional({
    type: 'object',
    example: { name: 'asc', createdAt: 'desc' },
    description: 'Order query',
    required: false,
  })
  readonly orderBy?: OrderBy;
}
