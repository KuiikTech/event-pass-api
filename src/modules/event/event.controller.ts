import {
  Controller,
  UseGuards,
  Post,
  Query,
  Body,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { routesV1 } from 'src/app.routes';
import { ErrorResponse } from 'src/libs/api/responses/error.response';
import { ParseMongoIdPipe } from 'src/libs/application/pipes/parse-mongo-id.pipe';

import { EventService, FindEventQuery } from './event.service';
import { ResponseEventDto } from './dto/response-event.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { RequestEventDto } from './dto/request-event.dto';
import { PaginatedQueryDto } from 'src/libs/api/dto/paginated-query.dto';
import { PaginatedResponseEventDto } from './dto/paginated-response-event.dto';

@ApiTags(`/${routesV1.event.root}`)
@Controller({ version: routesV1.version })
export class EventController {
  constructor(private eventService: EventService) {}

  @ApiOperation({ summary: 'Create a event' })
  @ApiOkResponse({ type: ResponseEventDto })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post(routesV1.event.create)
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @ApiOperation({ summary: 'List events' })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @UseGuards(AuthGuard('jwt'))
  @Get(routesV1.event.root)
  async list(
    @Body() requestUserDto: RequestEventDto,
    @Query() paginatedQueryDto: PaginatedQueryDto,
  ): Promise<PaginatedResponseEventDto> {
    const query = new FindEventQuery({
      ...requestUserDto,
      limit: paginatedQueryDto?.limit,
      page: paginatedQueryDto?.page,
      orderBy: paginatedQueryDto?.orderBy,
    });

    const paginated = await this.eventService.find(query);

    return new PaginatedResponseEventDto({
      ...paginated,
    });
  }

  @ApiOperation({ summary: 'Find event by id' })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @UseGuards(AuthGuard('jwt'))
  @Get(routesV1.event.findById)
  async findById(
    @Param('id', ParseMongoIdPipe) id: string,
  ): Promise<ResponseEventDto> {
    return this.eventService.findById(id);
  }

  @ApiOperation({ summary: 'Delete event by id' })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @UseGuards(AuthGuard('jwt'))
  @Delete(routesV1.event.delete)
  async delete(@Param('id', ParseMongoIdPipe) id: string): Promise<void> {
    this.eventService.delete(id);
  }
}
