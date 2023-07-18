import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
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
}

export const EventSchema = SchemaFactory.createForClass(EventModel);
