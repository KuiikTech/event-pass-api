import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';

import { PayloadEntity } from 'src/modules/auth/entities/payload.entity';
import { UserService } from 'src/modules/user/user.service';
import { UserModel } from 'src/modules/user/schemas/user.schema';

import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async login(loginDto: LoginDto) {
    const user: UserModel = await this.userService.findByLogin(loginDto);
    const payload = {
      id: user.id,
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
