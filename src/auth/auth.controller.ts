import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { RegisterUserDto } from 'src/user/dto/register-user.dto';
import { UserService } from 'src/user/user.service';
import { routesV1 } from 'src/app.routes';
import { User } from 'src/user/schemas/user.schema';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags(`/${routesV1.auth.root}`)
@Controller({
  version: routesV1.version,
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post(routesV1.auth.register)
  @UseGuards(AuthGuard('jwt'))
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post(routesV1.auth.login)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
