import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventModelName, EventSchema } from './schemas/event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: EventModelName,
        schema: EventSchema,
      },
    ]),
  ],
  providers: [EventService],
  controllers: [EventController],
  exports: [EventService],
})
export class EventModule {}
