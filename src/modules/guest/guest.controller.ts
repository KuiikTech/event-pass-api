import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { ErrorResponse } from 'src/libs/api/responses/error.response';
import { routesV1 } from 'src/app.routes';

import { GuestService } from './guest.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { ResponseGuestDto } from './dto/response-guest.dto';

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
}
