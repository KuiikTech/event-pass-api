import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  USER_MODEL_NAME,
  UserSchema,
} from 'src/modules/user/schemas/user.schema';

import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: USER_MODEL_NAME,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
