import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
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
import { ParseMongoIdPipe } from 'src/libs/application/pipes/parse-mongo-id.pipe';
import { PaginatedQueryDto } from 'src/libs/api/dto/paginated-query.dto';

import { ResponseCodeDto } from './dto/response-code.dto';
import { CreateManyCodesDto } from './dto/create-many-codes.dto';
import { CodeService, FindCodeQuery, PartialUpdateCode } from './code.service';
import { RequestCodeDto } from './dto/request-code.dto';
import { PaginatedResponseCodeDto } from './dto/paginated-response-user.dto';
import { UpdateCodeDto } from './dto/update-code.dto';
import { ResponseUpdateManyCodesDto } from './dto/response-update-many-codes.dto';

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

  @ApiOperation({ summary: 'Find codes by event id' })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @UseGuards(AuthGuard('jwt'))
  @Get(routesV1.code.findByEventId)
  async findByEventId(
    @Param('eventId', ParseMongoIdPipe) eventId: string,
    @Query() paginatedQueryDto: PaginatedQueryDto,
  ): Promise<PaginatedResponseCodeDto> {
    const query = new FindCodeQuery({
      eventId,
      limit: paginatedQueryDto?.limit,
      page: paginatedQueryDto?.page,
      orderBy: paginatedQueryDto?.orderBy,
    });
    const paginated = await this.codeService.findByEventId(query);

    return new PaginatedResponseCodeDto({
      ...paginated,
    });
  }

  @ApiOperation({ summary: 'List codes' })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @UseGuards(AuthGuard('jwt'))
  @Get(routesV1.code.root)
  async list(
    @Body() requestCodeDto: RequestCodeDto,
    @Query() paginatedQueryDto: PaginatedQueryDto,
  ): Promise<PaginatedResponseCodeDto> {
    const query = new FindCodeQuery({
      ...requestCodeDto,
      limit: paginatedQueryDto?.limit,
      page: paginatedQueryDto?.page,
      orderBy: paginatedQueryDto?.orderBy,
    });

    const paginated = await this.codeService.findWithExact(query);

    return new PaginatedResponseCodeDto({
      ...paginated,
    });
  }

  @ApiOperation({ summary: 'Update code by id' })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @UseGuards(AuthGuard('jwt'))
  @Patch(routesV1.code.update)
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateCodeDto: UpdateCodeDto,
  ): Promise<ResponseCodeDto> {
    const partialUpdateCode = new PartialUpdateCode({
      ...updateCodeDto,
    });

    return this.codeService.update(id, partialUpdateCode);
  }

  @ApiOperation({ summary: 'Update many codes by eventId' })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @UseGuards(AuthGuard('jwt'))
  @Patch(routesV1.code.updateByEventId)
  async updateByEventId(
    @Param('eventId', ParseMongoIdPipe) eventId: string,
    @Body() updateCodeDto: UpdateCodeDto,
  ): Promise<ResponseUpdateManyCodesDto> {
    const partialUpdateCode = new PartialUpdateCode({
      ...updateCodeDto,
    });

    const modifiedCount = await this.codeService.updateByEventId(
      eventId,
      partialUpdateCode,
    );

    return {
      modifiedCount,
    };
  }

  @ApiOperation({ summary: 'Delete code by id' })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @UseGuards(AuthGuard('jwt'))
  @Delete(routesV1.code.delete)
  async delete(@Param('id', ParseMongoIdPipe) id: string): Promise<void> {
    this.codeService.delete(id);
  }
}
