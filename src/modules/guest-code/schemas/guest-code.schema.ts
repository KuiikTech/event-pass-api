import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

import { CODE_MODEL_NAME } from 'src/modules/code/schemas/code.schema';
import { EVENT_MODEL_NAME } from 'src/modules/event/schemas/event.schema';
import { GUEST_MODEL_NAME } from 'src/modules/guest/schemas/guest.schema';

import { GuestCodeStatusType } from '../types/guest-code-status.type';

export const GUEST_CODE_MODEL_NAME = 'GuestCode';

@Schema({
  timestamps: true,
})
export class GuestCodeModel extends Document {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: EVENT_MODEL_NAME,
    required: true,
  })
  eventId: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: GUEST_MODEL_NAME,
    required: true,
  })
  guestId: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: CODE_MODEL_NAME,
    required: true,
  })
  codeId: string;

  @Prop({
    type: Number,
    default: 0,
  })
  initialAmount: number;

  @Prop({
    type: Number,
    default: 0,
  })
  count: number;

  @Prop({
    type: String,
    required: true,
    enum: GuestCodeStatusType,
    default: GuestCodeStatusType.ACTIVE,
  })
  status: string;
}

export const GuestCodeSchema = SchemaFactory.createForClass(GuestCodeModel);

GuestCodeSchema.pre('find', function (next) {
  const statusFilter = this.getQuery().status;
  if (!statusFilter) {
    this.where({ status: { $ne: GuestCodeStatusType.DELETED } });
  }
  return next();
});
