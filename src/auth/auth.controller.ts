import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { RegisterUserDto } from 'src/user/dto/register-user.dto';
import { routesV1 } from 'src/app.routes';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ResponseLoginDto } from './dto/response-login.dto';
import { ErrorResponse } from 'src/libs/api/responses/error.response';

@ApiTags(`/${routesV1.auth.root}`)
@Controller({
  version: routesV1.version,
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Register a user' })
  @ApiOkResponse({ type: ResponseLoginDto })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post(routesV1.auth.register)
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @ApiOperation({ summary: 'Login a user' })
  @ApiOkResponse({ type: ResponseLoginDto })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @Post(routesV1.auth.login)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
