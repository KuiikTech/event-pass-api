import {
  Controller,
  UseGuards,
  Post,
  Query,
  Body,
  Get,
  Param,
  Patch,
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
import { PaginatedQueryWithSearchDto } from 'src/libs/api/dto/paginated-query-with-search.dto';
import { PaginatedQueryDto } from 'src/libs/api/dto/paginated-query.dto';

import {
  EventService,
  FindEventQuery,
  PartialUpdateEvent,
} from './event.service';
import { ResponseEventDto } from './dto/response-event.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { RequestEventDto } from './dto/request-event.dto';
import { PaginatedResponseEventDto } from './dto/paginated-response-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@ApiTags(`/${routesV1.event.root}`)
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({ version: routesV1.version })
export class EventController {
  constructor(private eventService: EventService) {}

  @ApiOperation({ summary: 'Create a event' })
  @ApiOkResponse({ type: ResponseEventDto })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @Post(routesV1.event.create)
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @ApiOperation({ summary: 'List events' })
  @ApiBadRequestResponse({ type: ErrorResponse })
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

    const paginated = await this.eventService.searchExact(query);

    return new PaginatedResponseEventDto({
      ...paginated,
    });
  }

  @ApiOperation({
    summary: 'List events with search value by: name, address, city, host',
  })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @Get(routesV1.event.search)
  async listWithSearch(
    @Query() paginatedQueryWithSearchDto: PaginatedQueryWithSearchDto,
  ): Promise<PaginatedResponseEventDto> {
    const query = new FindEventQuery({
      ...paginatedQueryWithSearchDto,
      name: paginatedQueryWithSearchDto?.search,
      address: paginatedQueryWithSearchDto?.search,
      city: paginatedQueryWithSearchDto?.search,
      host: paginatedQueryWithSearchDto?.search,
    });

    const paginated = await this.eventService.search(query);

    return new PaginatedResponseEventDto({
      ...paginated,
    });
  }

  @ApiOperation({ summary: 'Find event by id' })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @Get(routesV1.event.searchById)
  async findById(
    @Param('id', ParseMongoIdPipe) id: string,
  ): Promise<ResponseEventDto> {
    return this.eventService.findById(id);
  }

  @ApiOperation({ summary: 'Update event' })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @Patch(routesV1.event.update)
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<ResponseEventDto> {
    const partialUpdateUser = new PartialUpdateEvent({
      ...updateEventDto,
    });

    return this.eventService.update(id, partialUpdateUser);
  }

  @ApiOperation({ summary: 'Delete event by id' })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @Delete(routesV1.event.delete)
  async delete(@Param('id', ParseMongoIdPipe) id: string): Promise<void> {
    this.eventService.delete(id);
  }
}
