import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';

import { PayloadEntity } from 'src/auth/entities/payload.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/schemas/user.schema';
import { RegisterUserDto } from 'src/user/dto/register-user.dto';

import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async login(loginDto: LoginDto) {
    const user: User = await this.userService.findByLogin(loginDto);
    const payload = {
      id: user._id,
    };
    const token = await this.signPayload(payload);
    return { user, token };
  }

  async register(registerUserDto: RegisterUserDto) {
    const user: User = await this.userService.create(registerUserDto);
    const payload = {
      id: user._id,
    };

    const token = await this.signPayload(payload);
    return { user, token };
  }

  async signPayload(payload: PayloadEntity) {
    return sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRATION_TIME,
    });
  }

  async validateUser(payload: PayloadEntity) {
    return await this.userService.findByPayload(payload);
  }
}
