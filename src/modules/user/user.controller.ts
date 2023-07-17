import { Controller, UseGuards, Post, Body, Query, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { routesV1 } from 'src/app.routes';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { ErrorResponse } from 'src/libs/api/responses/error.response';
import { PaginatedQueryDto } from 'src/libs/api/dto/paginated-query.dto';

import { FindUserQuery, UserService } from './user.service';
import { ResponseUserDto } from './dto/response-user.dto';
import { RequestUserDto } from './dto/request-user.dto';
import { PaginatedResponseUserDto } from './dto/paginated-response-user.dto';

@ApiTags(`/${routesV1.user.create}`)
@ApiBearerAuth()
@Controller({ version: routesV1.version })
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Create a user' })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @UseGuards(AuthGuard('jwt'))
  @Post(routesV1.user.create)
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseUserDto> {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'List users' })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @UseGuards(AuthGuard('jwt'))
  @Get(routesV1.user.root)
  async list(
    @Body() requestUserDto: RequestUserDto,
    @Query() paginatedQueryDto: PaginatedQueryDto,
  ): Promise<PaginatedResponseUserDto> {
    const query = new FindUserQuery({
      ...requestUserDto,
      limit: paginatedQueryDto?.limit,
      page: paginatedQueryDto?.page,
      orderBy: paginatedQueryDto?.orderBy,
    });

    const paginated = await this.userService.find(query);

    return new PaginatedResponseUserDto({
      ...paginated,
    });
  }
}
