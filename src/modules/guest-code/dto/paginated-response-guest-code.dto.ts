import { ApiProperty } from '@nestjs/swagger';

import { PaginatedResponseDto } from 'src/libs/api/responses/paginated.response.base';

import { ResponseGuestCodeDto } from './response-guest-code.dto';

export class PaginatedResponseGuestCodeDto extends PaginatedResponseDto<ResponseGuestCodeDto> {
  @ApiProperty({ type: ResponseGuestCodeDto, isArray: true })
  readonly data: readonly ResponseGuestCodeDto[];
}
