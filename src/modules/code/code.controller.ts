import { Body, Controller, Post, UseGuards, Get, Param } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { routesV1 } from 'src/app.routes';
import { ErrorResponse } from 'src/libs/api/responses/error.response';

import { ResponseCodeDto } from './dto/response-code.dto';
import { CreateManyCodesDto } from './dto/create-many-codes.dto';
import { CodeService } from './code.service';
import { ParseMongoIdPipe } from 'src/libs/application/pipes/parse-mongo-id.pipe';

@ApiTags(`/${routesV1.code.root}`)
@Controller({ version: routesV1.version })
export class CodeController {
  constructor(private codeService: CodeService) {}

  @ApiOperation({ summary: 'Create many codes' })
  @ApiOkResponse({ type: ResponseCodeDto })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post(routesV1.code.create)
  async createMany(
    @Body() createManyCodesDto: CreateManyCodesDto,
  ): Promise<ResponseCodeDto[]> {
    return this.codeService.createMany(createManyCodesDto);
  }

  @ApiOperation({ summary: 'Find code by id' })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @UseGuards(AuthGuard('jwt'))
  @Get(routesV1.code.findById)
  async findById(
    @Param('id', ParseMongoIdPipe) id: string,
  ): Promise<ResponseCodeDto> {
    return this.codeService.findById(id);
  }
}
