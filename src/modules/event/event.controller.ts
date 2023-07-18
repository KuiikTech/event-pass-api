import { Controller, UseGuards, Post, Body } from '@nestjs/common';
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

import { EventService } from './event.service';
import { ResponseEventDto } from './dto/response-event.dto';
import { CreateEventDto } from './dto/create-event.dto';

@ApiTags(`/${routesV1.event.root}`)
@Controller({ version: routesV1.version })
export class EventController {
  constructor(private eventService: EventService) {}

  @ApiOperation({ summary: 'Create a event' })
  @ApiOkResponse({ type: ResponseEventDto })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post(routesV1.guest.create)
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }
}
