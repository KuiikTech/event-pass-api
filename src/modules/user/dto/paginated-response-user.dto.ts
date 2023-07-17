import { ApiProperty } from '@nestjs/swagger';

import { PaginatedResponseDto } from 'src/libs/api/responses/paginated.response.base';

import { ResponseUserDto } from './response-user.dto';

export class PaginatedResponseUserDto extends PaginatedResponseDto<ResponseUserDto> {
  @ApiProperty({ type: ResponseUserDto, isArray: true })
  readonly data: readonly ResponseUserDto[];
}
