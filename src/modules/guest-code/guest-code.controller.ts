import {
  Controller,
  Get,
  UseGuards,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponse } from 'src/libs/api/responses/error.response';
import { ParseMongoIdPipe } from 'src/libs/application/pipes/parse-mongo-id.pipe';
import { routesV1 } from 'src/app.routes';

import { CreateGuestCodeDto } from './dto/create-guest-code.dto';
import { FindGuestCodeQuery, GuestCodeService } from './guest-code.service';
import { ResponseGuestCodeDto } from './dto/response-guest-code.dto';
import { UpdateGuestCodeDto } from './dto/update-guest-code.dto';
import { RequestGuestCodeDto } from './dto/request-guest-code.dto';
import { PaginatedQueryDto } from 'src/libs/api/dto/paginated-query.dto';
import { PaginatedResponseGuestCodeDto } from './dto/paginated-response-guest-code.dto';
import { PaginatedQueryWithSearchDto } from 'src/libs/api/dto/paginated-query-with-search.dto';

@ApiTags(`/${routesV1.guestCode.root}`)
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({ version: routesV1.version })
export class GuestCodeController {
  constructor(private guestCodeService: GuestCodeService) {}

  @ApiOperation({ summary: 'Create a record of a code to an event' })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @Post(routesV1.guestCode.create)
  async register(
    @Body() createGuestCodeDto: CreateGuestCodeDto,
  ): Promise<ResponseGuestCodeDto> {
    return this.guestCodeService.create(createGuestCodeDto);
  }

  @ApiOperation({
    summary: 'Update the registration of a code in an event by the id',
  })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @Patch(routesV1.guestCode.update)
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateGuestCodeDto: UpdateGuestCodeDto,
  ): Promise<ResponseGuestCodeDto> {
    return this.guestCodeService.updateById(id, updateGuestCodeDto);
  }

  @ApiOperation({
    summary: 'Update the registration of a code in an event by the uuid',
  })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @Patch(routesV1.guestCode.updateByUuid)
  async updateByUuid(
    @Param('uuid') uuid: string,
    @Body() updateGuestCodeDto: UpdateGuestCodeDto,
  ): Promise<ResponseGuestCodeDto> {
    return this.guestCodeService.updateByUuid(uuid, updateGuestCodeDto);
  }

  @ApiOperation({
    summary: 'Checkin a guest by the uuid of the code',
  })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @Patch(routesV1.guestCode.checkinByUuid)
  async checkinByUuid(
    @Param('uuid') uuid: string,
  ): Promise<ResponseGuestCodeDto> {
    return this.guestCodeService.checkinByUuid(uuid);
  }

  @ApiOperation({
    summary:
      'List the codes registered to events with an exact search in fields',
  })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @Get(routesV1.guestCode.searchExact)
  async listUsers(
    @Body() requestGuestCodeDto: RequestGuestCodeDto,
    @Query() paginatedQueryDto: PaginatedQueryDto,
  ): Promise<PaginatedResponseGuestCodeDto> {
    const query = new FindGuestCodeQuery({
      ...requestGuestCodeDto,
      limit: paginatedQueryDto?.limit,
      page: paginatedQueryDto?.page,
      orderBy: paginatedQueryDto?.orderBy,
    });

    const paginated = await this.guestCodeService.searchExact(query);

    return new PaginatedResponseGuestCodeDto({
      ...paginated,
    });
  }

  @ApiOperation({
    summary:
      'List the codes registered to events with a search in the fields: eventId, guestId, codeId',
  })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @Get(routesV1.guestCode.search)
  async listUsersWithSearch(
    @Query() paginatedQueryWithSearchDto: PaginatedQueryWithSearchDto,
  ): Promise<PaginatedResponseGuestCodeDto> {
    const query = new FindGuestCodeQuery({
      ...paginatedQueryWithSearchDto,
      eventId: paginatedQueryWithSearchDto?.search,
      guestId: paginatedQueryWithSearchDto?.search,
      codeId: paginatedQueryWithSearchDto?.search,
    });

    const paginated = await this.guestCodeService.search(query);

    return new PaginatedResponseGuestCodeDto({
      ...paginated,
    });
  }
}
