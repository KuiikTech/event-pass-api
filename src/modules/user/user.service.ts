import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { PayloadEntity } from 'src/modules/auth/entities/payload.entity';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { RolesType } from 'src/modules/auth/types/roles.types';

import { UserModel } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserStatusType } from './types/user-status.type';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<UserModel>) {}

  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
    }
    if (!createUserDto.roles || createUserDto.roles.length === 0) {
      createUserDto.roles = [RolesType.GUEST];
    }
    if (
      !createUserDto.status ||
      Object.values(UserStatusType).includes(createUserDto.status)
    ) {
      createUserDto.status = UserStatusType.ACTIVE;
    }

    const createdUser = new this.userModel(createUserDto);
    await createdUser.save();

    return this.sanitizeUser(createdUser);
  }

  async findByLogin(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
    }
    if (await bcrypt.compare(password, user.password)) {
      return this.sanitizeUser(user);
    } else {
      throw new HttpException('invalid credential', HttpStatus.BAD_REQUEST);
    }
  }

  async findByPayload(payload: PayloadEntity) {
    const { id } = payload;
    const user = await this.userModel.findById(id);
    return this.sanitizeUser(user);
  }

  private sanitizeUser(user: UserModel) {
    const sanitized = user.toObject();
    delete sanitized['password'];
    return sanitized;
  }
}
