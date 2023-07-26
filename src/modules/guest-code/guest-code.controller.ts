import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { routesV1 } from 'src/app.routes';
import { ErrorResponse } from 'src/libs/api/responses/error.response';

import { CreateGuestCodeDto } from './dto/create-guest-code.dto';
import { GuestCodeService } from './guest-code.service';
import { ResponseGuestCodeDto } from './dto/response-guest-code.dto';

@ApiTags(`/${routesV1.guestCode.root}`)
@ApiBearerAuth()
@Controller({ version: routesV1.version })
export class GuestCodeController {
  constructor(private guestCodeService: GuestCodeService) {}

  @ApiOperation({ summary: 'Create a record of a code to an event' })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @UseGuards(AuthGuard('jwt'))
  @Post(routesV1.guestCode.create)
  async register(
    @Body() createGuestCodeDto: CreateGuestCodeDto,
  ): Promise<ResponseGuestCodeDto> {
    return this.guestCodeService.create(createGuestCodeDto);
  }
}
