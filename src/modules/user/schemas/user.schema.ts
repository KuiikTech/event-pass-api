import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Document } from 'mongoose';

import { UserStatusType } from '../types/user-status.type';
import { IsOptional } from 'class-validator';

@Schema()
export class UserModel extends Document {
  @Prop({
    type: String,
    required: true,
  })
  firstName: string;

  @Prop({
    type: String,
    required: true,
  })
  lastName: string;

  @Prop({
    type: String,
    match: /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/,
  })
  phone: string;

  @Prop({
    type: String,
    unique: true,
    required: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: [String],
    validate: [
      (val: string[]) => val.length > 0,
      'Must have minimum one options',
    ],
  })
  roles: string[];

  @Prop({
    type: String,
    required: true,
    enum: UserStatusType,
  })
  @IsOptional()
  status: string;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);

UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const hashed = await bcrypt.hash(this['password'], 10);
    this['password'] = hashed;
    return next();
  } catch (err) {
    return next(err);
  }
});
