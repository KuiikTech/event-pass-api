import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { EventStatusType } from '../types/event-status.type';

export const EVENT_MODEL_NAME = 'Event';

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
      validator: (date: Date) => date.getDate() >= new Date().getDate(),
      message: 'Initial date must be equal or greater than current date.',
    },
  })
  initialDate: Date;

  @Prop({
    required: true,
    validate: {
      validator: function (date: Date) {
        return date.getDate() >= this.initialDate.getDate();
      },
      message: 'Final date must be equal or greater than initial date.',
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
