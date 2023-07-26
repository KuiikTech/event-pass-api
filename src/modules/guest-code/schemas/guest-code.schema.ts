import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

import { CodeModelName } from 'src/modules/code/schemas/code.schema';
import { EventModelName } from 'src/modules/event/schemas/event.schema';
import { GuestModelName } from 'src/modules/guest/schemas/guest.schema';

import { GuestCodeStatusType } from '../types/guest-code-status.type';

export const GuestCodeModelName = 'GuestCode';

@Schema({
  timestamps: true,
})
export class GuestCodeModel extends Document {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: EventModelName,
    required: true,
  })
  eventId: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: GuestModelName,
    required: true,
  })
  guestId: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: CodeModelName,
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
