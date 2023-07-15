import { Controller, UseGuards, Post, Body } from '@nestjs/common';
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

import { UserService } from './user.service';
import { ResponseUserDto } from './dto/response-user.dto';

@ApiTags(`/${routesV1.user.create}`)
@ApiBearerAuth()
@Controller({ version: routesV1.version })
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Create a user' })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @UseGuards(AuthGuard('jwt'))
  @Post(routesV1.user.create)
  async create(@Body() createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    return this.userService.create(createUserDto);
  }
}
