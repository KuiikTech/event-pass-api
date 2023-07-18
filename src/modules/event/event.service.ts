import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

import { EventModel } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectModel('Event') private eventModel: PaginateModel<EventModel>,
  ) {}

  async create(createEventDto: CreateEventDto) {
    const createdEvent = new this.eventModel(createEventDto);
    await createdEvent.save();
  }
}
