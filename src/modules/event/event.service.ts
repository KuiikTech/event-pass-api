import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

import { PaginatedParams, PaginatedQueryBase } from 'src/libs/ddd/query.base';
import {
  FilterToFindFactory,
  FilterToFindWithSearchRegex,
  Paginated,
  SearchFilters,
} from 'src/libs/ports/repository.port';

import { EventModel, EVENT_MODEL_NAME } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { EventStatusType } from './types/event-status.type';

export class FindEventQuery extends PaginatedQueryBase {
  readonly name?: string;
  readonly address?: string;
  readonly city?: string;
  readonly initialDate?: Date;
  readonly finalDate?: Date;
  readonly host?: string;
  readonly status?: string;

  constructor(props: PaginatedParams<FindEventQuery>) {
    super(props);
    this.name = props.name;
    this.address = props.address;
    this.city = props.city;
    this.initialDate = props.initialDate;
    this.finalDate = props.finalDate;
    this.host = props.host;
    this.status = props.status;
  }
}

export class PartialUpdateEvent {
  readonly name?: string;
  readonly description?: string;
  readonly address?: string;
  readonly city?: string;
  readonly initialDate?: Date;
  readonly finalDate?: Date;
  readonly host?: string;
  readonly guestRoles?: string[];
  readonly status?: string;

  constructor(props: PartialUpdateEvent) {
    this.name = props.name;
    this.description = props.description;
    this.address = props.address;
    this.city = props.city;
    this.initialDate = props.initialDate;
    this.finalDate = props.finalDate;
    this.host = props.host;
    this.guestRoles = props.guestRoles;
    this.status = props.status;
  }
}

@Injectable()
export class EventService {
  constructor(
    @InjectModel(EVENT_MODEL_NAME)
    private eventModel: PaginateModel<EventModel>,
  ) {}

  async create(createEventDto: CreateEventDto) {
    const createdEvent = new this.eventModel(createEventDto);
    await createdEvent.save();

    return this.sanitize(createdEvent);
  }

  async find(
    filters: SearchFilters | FilterToFindWithSearchRegex,
    paginatedQueryBase: PaginatedQueryBase,
  ) {
    const result = await this.eventModel.paginate(
      { ...filters },
      {
        limit: paginatedQueryBase.limit,
        offset: paginatedQueryBase.offset,
        page: paginatedQueryBase.page,
        sort: paginatedQueryBase.orderBy,
      },
    );

    return new Paginated({
      data: result.docs.map((event) => this.sanitize(event)),
      count: result.totalDocs,
      limit: result.limit,
      page: result.page,
    });
  }

  async searchExact(findEventQuery: FindEventQuery) {
    return this.find(
      {
        name: findEventQuery.name,
        address: findEventQuery.address,
        city: findEventQuery.city,
        initialDate: findEventQuery.initialDate,
        finalDate: findEventQuery.finalDate,
        host: findEventQuery.host,
        status: findEventQuery.status,
      },
      { ...findEventQuery },
    );
  }

  async search(findEventQuery: FindEventQuery) {
    const searchCriteria: FilterToFindWithSearchRegex =
      FilterToFindFactory.createFilterWithSearch({
        name: `.*${findEventQuery.name}.*`,
        address: `.*${findEventQuery.address}.*`,
        city: `.*${findEventQuery.city}.*`,
        host: `.*${findEventQuery.host}.*`,
      });
    return this.find(searchCriteria, {
      ...findEventQuery,
    });
  }

  async findById(id: string) {
    const event = await this.eventModel.findById(id);
    if (!event) {
      throw new HttpException('event doesnt exists', HttpStatus.BAD_REQUEST);
    }
    return this.sanitize(event);
  }

  async update(id: string, partialUpdateEvent: PartialUpdateEvent) {
    const event = await this.eventModel.findById(id);
    if (!event) {
      throw new HttpException('event doesnt exists', HttpStatus.NOT_FOUND);
    }

    event.set({
      ...partialUpdateEvent,
    });

    const updatedEvent = await this.eventModel.findByIdAndUpdate(id, event, {
      new: true,
    });
    return this.sanitize(updatedEvent);
  }

  async delete(id: string) {
    const guest = await this.eventModel.findById(id);
    if (!guest) {
      throw new HttpException('guest doesnt exists', HttpStatus.NOT_FOUND);
    }

    await this.eventModel.findByIdAndUpdate(id, {
      status: EventStatusType.DELETED,
    });
  }

  private sanitize(event: EventModel) {
    const sanitized = event.toObject();
    // delete sanitized['password'];
    return sanitized;
  }
}
