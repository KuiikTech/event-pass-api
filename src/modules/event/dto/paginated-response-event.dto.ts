import { ApiProperty } from '@nestjs/swagger';

import { PaginatedResponseDto } from 'src/libs/api/responses/paginated.response.base';

import { ResponseEventDto } from './response-event.dto';

export class PaginatedResponseEventDto extends PaginatedResponseDto<ResponseEventDto> {
  @ApiProperty({ type: ResponseEventDto, isArray: true })
  readonly data: readonly ResponseEventDto[];
}
