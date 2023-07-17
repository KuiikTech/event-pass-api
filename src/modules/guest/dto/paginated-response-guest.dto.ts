import { ApiProperty } from '@nestjs/swagger';

import { PaginatedResponseDto } from 'src/libs/api/responses/paginated.response.base';

import { ResponseGuestDto } from './response-guest.dto';

export class PaginatedResponseGuestDto extends PaginatedResponseDto<ResponseGuestDto> {
  @ApiProperty({ type: ResponseGuestDto, isArray: true })
  readonly data: readonly ResponseGuestDto[];
}
