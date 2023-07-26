import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { EventStatusType } from '../types/event-status.type';

export const EventModelName = 'Event';

@Schema({
  timestamps: true,
})
export class EventModel extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: String })
  address?: string;

  @Prop({ type: String })
  city?: string;

  @Prop({
    required: true,
    validate: {
      validator: (date) => date.getTime() > Date.now(),
      message: 'Initial date must be in the future.',
    },
  })
  initialDate: Date;

  @Prop({
    required: true,
    validate: {
      validator: function (date) {
        return date.getTime() > this.initialDate.getTime();
      },
      message: 'Final date must be later than initial date.',
    },
  })
  finalDate: Date;

  @Prop({ type: String })
  host?: string;

  @Prop({
    type: [String],
  })
  guestRoles: string[];

  @Prop({
    type: String,
    required: true,
    enum: EventStatusType,
    default: EventStatusType.ACTIVE,
  })
  status: string;
}

export const EventSchema = SchemaFactory.createForClass(EventModel);

EventSchema.pre('find', function (next) {
  const statusFilter = this.getQuery().status;
  if (!statusFilter) {
    this.where({ status: { $ne: EventStatusType.DELETED } });
  }
  return next();
});
