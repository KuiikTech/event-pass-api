import {
  Controller,
  UseGuards,
  Post,
  Body,
  Query,
  Get,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
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
import { ParseMongoIdPipe } from 'src/libs/application/pipes/parse-mongo-id.pipe';
import { PaginatedQueryWithSearchDto } from 'src/libs/api/dto/paginated-query-with-search.dto';

import { FindUserQuery, PartialUpdateUser, UserService } from './user.service';
import { ResponseUserDto } from './dto/response-user.dto';
import { RequestUserDto } from './dto/request-user.dto';
import { PaginatedResponseUserDto } from './dto/paginated-response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags(`/${routesV1.user.root}`)
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({ version: routesV1.version })
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Create a user' })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @Post(routesV1.user.create)
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseUserDto> {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'List users' })
  @ApiBadRequestResponse({ type: ErrorResponse })
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

    const paginated = await this.userService.findWithExact(query);

    return new PaginatedResponseUserDto({
      ...paginated,
    });
  }

  @ApiOperation({
    summary: 'List users with search value by: firstName, lastName, email',
  })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @Get(routesV1.user.findWithSearch)
  async listWithSearch(
    @Query() paginatedQueryWithSearchDto: PaginatedQueryWithSearchDto,
  ): Promise<PaginatedResponseUserDto> {
    const query = new FindUserQuery({
      ...paginatedQueryWithSearchDto,
      firstName: paginatedQueryWithSearchDto?.search,
      lastName: paginatedQueryWithSearchDto?.search,
      email: paginatedQueryWithSearchDto?.search,
    });

    const paginated = await this.userService.findWithSearch(query);

    return new PaginatedResponseUserDto({
      ...paginated,
    });
  }

  @ApiOperation({ summary: 'Find user by id' })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @Get(routesV1.user.findById)
  async findById(
    @Param('id', ParseMongoIdPipe) id: string,
  ): Promise<ResponseUserDto> {
    return this.userService.findById(id);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @Patch(routesV1.user.update)
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    const partialUpdateUser = new PartialUpdateUser({
      ...updateUserDto,
    });

    return this.userService.update(id, partialUpdateUser);
  }

  @ApiOperation({ summary: 'Delete user by id' })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @Delete(routesV1.user.delete)
  async delete(@Param('id', ParseMongoIdPipe) id: string): Promise<void> {
    this.userService.delete(id);
  }
}
