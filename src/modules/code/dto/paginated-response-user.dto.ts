import { ApiProperty } from '@nestjs/swagger';

import { PaginatedResponseDto } from 'src/libs/api/responses/paginated.response.base';

import { ResponseCodeDto } from './response-code.dto';

export class PaginatedResponseCodeDto extends PaginatedResponseDto<ResponseCodeDto> {
  @ApiProperty({ type: ResponseCodeDto, isArray: true })
  readonly data: readonly ResponseCodeDto[];
}
