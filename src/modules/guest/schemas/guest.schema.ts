import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { GuestStatusType } from '../types/guest-status.type';

@Schema({
  timestamps: true,
})
export class GuestModel extends Document {
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
  })
  documentNumber: string;

  @Prop({
    type: String,
    required: true,
    enum: GuestStatusType,
    default: GuestStatusType.ACTIVE,
  })
  status: string;
}

export const GuestSchema = SchemaFactory.createForClass(GuestModel);

GuestSchema.pre('find', function (next) {
  const statusFilter = this.getQuery().status;
  if (!statusFilter) {
    this.where({ status: { $ne: GuestStatusType.DELETED } });
  }
  return next();
});
