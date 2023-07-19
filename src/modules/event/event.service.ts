import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

import { EventModel } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { PaginatedParams, PaginatedQueryBase } from 'src/libs/ddd/query.base';
import { Paginated } from 'src/libs/ports/repository.port';

export class FindEventQuery extends PaginatedQueryBase {
  readonly name?: string;
  readonly address?: string;
  readonly city?: string;
  readonly initialDate?: Date;
  readonly finalDate?: Date;
  readonly host?: string;

  constructor(props: PaginatedParams<FindEventQuery>) {
    super(props);
    this.name = props.name;
    this.address = props.address;
    this.city = props.city;
    this.initialDate = props.initialDate;
    this.finalDate = props.finalDate;
    this.host = props.host;
  }
}

@Injectable()
export class EventService {
  constructor(
    @InjectModel('Event') private eventModel: PaginateModel<EventModel>,
  ) {}

  async create(createEventDto: CreateEventDto) {
    const createdEvent = new this.eventModel(createEventDto);
    await createdEvent.save();

    return this.sanitize(createdEvent);
  }

  async find(findUserQuery: FindEventQuery) {
    const filters = {
      name: findUserQuery.name,
      address: findUserQuery.address,
      city: findUserQuery.city,
      initialDate: findUserQuery.initialDate,
      finalDate: findUserQuery.finalDate,
      host: findUserQuery.host,
    };
    const result = await this.eventModel.paginate(
      { ...filters },
      {
        limit: findUserQuery.limit,
        offset: findUserQuery.offset,
        page: findUserQuery.page,
        sort: findUserQuery.orderBy,
      },
    );

    return new Paginated({
      data: result.docs.map((event) => this.sanitize(event)),
      count: result.totalDocs,
      limit: result.limit,
      page: result.page,
    });
  }

  async findById(id: string) {
    const event = await this.eventModel.findById(id);
    if (!event) {
      throw new HttpException('event doesnt exists', HttpStatus.BAD_REQUEST);
    }
    return this.sanitize(event);
  }

  private sanitize(event: EventModel) {
    const sanitized = event.toObject();
    // delete sanitized['password'];
    return sanitized;
  }
}
