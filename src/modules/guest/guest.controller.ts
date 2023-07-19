import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
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
import { ParseMongoIdPipe } from 'src/libs/application/pipes/parse-mongo-id.pipe';
import { routesV1 } from 'src/app.routes';

import {
  FindGuestQuery,
  GuestService,
  PartialUpdateGuest,
} from './guest.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { ResponseGuestDto } from './dto/response-guest.dto';
import { RequestGuestDto } from './dto/request-guest.dto';
import { PaginatedResponseGuestDto } from './dto/paginated-response-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

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

  @ApiOperation({ summary: 'Find guest by id' })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @UseGuards(AuthGuard('jwt'))
  @Get(routesV1.guest.findById)
  async findById(
    @Param('id', ParseMongoIdPipe) id: string,
  ): Promise<ResponseGuestDto> {
    return this.guestService.findById(id);
  }

  @ApiOperation({ summary: 'Update guest' })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @UseGuards(AuthGuard('jwt'))
  @Patch(routesV1.guest.update)
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateGuestDto: UpdateGuestDto,
  ): Promise<ResponseGuestDto> {
    const partialUpdateUser = new PartialUpdateGuest({
      ...updateGuestDto,
    });

    return this.guestService.update(id, partialUpdateUser);
  }

  @ApiOperation({ summary: 'Delete guest by id' })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @UseGuards(AuthGuard('jwt'))
  @Delete(routesV1.guest.delete)
  async delete(@Param('id', ParseMongoIdPipe) id: string): Promise<void> {
    this.guestService.delete(id);
  }
}
