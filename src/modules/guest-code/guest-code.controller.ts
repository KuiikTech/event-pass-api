import {
  Controller,
  UseGuards,
  Post,
  Patch,
  Body,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { routesV1 } from 'src/app.routes';
import { ErrorResponse } from 'src/libs/api/responses/error.response';
import { ParseMongoIdPipe } from 'src/libs/application/pipes/parse-mongo-id.pipe';

import { CreateGuestCodeDto } from './dto/create-guest-code.dto';
import { GuestCodeService, PartialUpdateGuestCode } from './guest-code.service';
import { ResponseGuestCodeDto } from './dto/response-guest-code.dto';
import { UpdateGuestCodeDto } from './dto/update-guest-code.dto';

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

  @ApiOperation({ summary: 'Update guest code by id' })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @Patch(routesV1.guestCode.update)
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateGuestCodeDto: UpdateGuestCodeDto,
  ): Promise<ResponseGuestCodeDto> {
    const partialUpdateCode = new PartialUpdateGuestCode({
      ...updateGuestCodeDto,
    });

    return this.guestCodeService.updatedGuestCodeById(id, partialUpdateCode);
  }

  @ApiOperation({ summary: 'Update guest code by uuid' })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @Patch(routesV1.guestCode.updateByUuid)
  async updateByCodeUuid(
    @Param('uuid') uuid: string,
    @Body() updateGuestCodeDto: UpdateGuestCodeDto,
  ): Promise<ResponseGuestCodeDto> {
    const partialUpdateCode = new PartialUpdateGuestCode({
      ...updateGuestCodeDto,
    });

    return this.guestCodeService.updatedGuestCodeByUuid(
      uuid,
      partialUpdateCode,
    );
  }
}
