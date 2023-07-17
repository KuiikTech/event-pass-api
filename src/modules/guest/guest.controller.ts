import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { ErrorResponse } from 'src/libs/api/responses/error.response';
import { PaginatedQueryDto } from 'src/libs/api/dto/paginated-query.dto';
import { routesV1 } from 'src/app.routes';

import { FindGuestQuery, GuestService } from './guest.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { ResponseGuestDto } from './dto/response-guest.dto';
import { RequestGuestDto } from './dto/request-guest.dto';
import { PaginatedResponseGuestDto } from './dto/paginated-response-guest.dto';

@ApiTags(`/${routesV1.guest.root}`)
@Controller({ version: routesV1.version })
export class GuestController {
  constructor(private guestService: GuestService) {}

  @ApiOperation({ summary: 'Create a guest' })
  @ApiOkResponse({ type: ResponseGuestDto })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post(routesV1.guest.create)
  async create(@Body() createGuestDto: CreateGuestDto) {
    return this.guestService.create(createGuestDto);
  }

  @ApiOperation({ summary: 'List guests' })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @UseGuards(AuthGuard('jwt'))
  @Get(routesV1.guest.root)
  async list(
    @Body() requestGuestDto: RequestGuestDto,
    @Query() paginatedQueryDto: PaginatedQueryDto,
  ): Promise<PaginatedResponseGuestDto> {
    const query = new FindGuestQuery({
      ...requestGuestDto,
      limit: paginatedQueryDto?.limit,
      page: paginatedQueryDto?.page,
      orderBy: paginatedQueryDto?.orderBy,
    });

    const paginated = await this.guestService.find(query);

    return new PaginatedResponseGuestDto({
      ...paginated,
    });
  }
}
