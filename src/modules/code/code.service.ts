import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidV4 } from 'uuid';
import { PaginateModel } from 'mongoose';

import {
  FilterToFindFactory,
  FilterToFindWithSearch,
  Paginated,
  SearchFilters,
} from 'src/libs/ports/repository.port';
import { PaginatedParams, PaginatedQueryBase } from 'src/libs/ddd/query.base';

import { CodeModel, CodeModelName } from './schemas/code.schema';
import { CreateManyCodesDto } from './dto/create-many-codes.dto';
import { EventService } from '../event/event.service';
import { CodeStatusType } from './types/code-status.type';
import { CodeTypesType } from './types/code-types.type';

interface FindCodeQueryProps {
  uuid?: string;
  type?: string;
  eventId?: string;
  status?: string;
}

export class FindCodeQuery extends PaginatedQueryBase {
  readonly uuid?: string;
  readonly type?: string;
  readonly eventId?: string;
  readonly status?: string;

  constructor(props: PaginatedParams<FindCodeQueryProps>) {
    super(props);
    this.uuid = props.uuid;
    this.type = props.type;
    this.eventId = props.eventId;
    this.status = props.status;
  }
}

export class PartialUpdateCode {
  readonly uuid?: string;

  readonly type?: CodeTypesType;

  readonly eventId?: string;

  readonly status?: CodeStatusType;

  constructor(props: PartialUpdateCode) {
    this.uuid = props.uuid;
    this.type = props.type;
    this.eventId = props.eventId;
    this.status = props.status;
  }
}

@Injectable()
export class CodeService {
  constructor(
    @InjectModel(CodeModelName) private codeModel: PaginateModel<CodeModel>,
    private eventService: EventService,
  ) {}

  async createMany(createManyCodesDto: CreateManyCodesDto) {
    const { eventId, type, amount } = createManyCodesDto;
    const event = await this.eventService.findById(eventId);
    if (!event) {
      throw new HttpException(
        'event with the provided id does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const codes = Array.from({ length: amount }).map(() => {
      const hash = uuidV4();
      return {
        uuid:
          type === CodeTypesType.QR
            ? hash.substring(0, 8)
            : parseInt(hash, 32).toString().substring(0, 8),
        type,
        eventId,
      };
    });

    return (await this.codeModel.insertMany(codes)).map((code) =>
      this.sanitize(code),
    );
  }

  async findById(id: string) {
    const code = await this.codeModel.findById(id);
    if (!code) {
      throw new HttpException('code doesnt exists', HttpStatus.BAD_REQUEST);
    }
    return this.sanitize(code);
  }

  async find(
    filters: SearchFilters | FilterToFindWithSearch,
    paginatedQueryBase: PaginatedQueryBase,
  ) {
    const result = await this.codeModel.paginate(
      { ...filters },
      {
        limit: paginatedQueryBase.limit,
        offset: paginatedQueryBase.offset,
        page: paginatedQueryBase.page,
        sort: paginatedQueryBase.orderBy,
      },
    );

    return new Paginated({
      data: result.docs.map((user) => this.sanitize(user)),
      count: result.totalDocs,
      limit: result.limit,
      page: result.page,
    });
  }

  async findOne(findCodeQuery: FindCodeQueryProps) {
    return this.codeModel.findOne(findCodeQuery);
  }

  async findByEventId(findCodeQuery: FindCodeQuery) {
    return this.find(
      {
        eventId: findCodeQuery.eventId,
      },
      { ...findCodeQuery },
    );
  }

  async findWithExact(findCodeQuery: FindCodeQuery) {
    return this.find(
      {
        uuid: findCodeQuery.uuid,
        type: findCodeQuery.type,
        eventId: findCodeQuery.eventId,
        status: findCodeQuery.status,
      },
      { ...findCodeQuery },
    );
  }

  async findWithSearch(findCodeQuery: FindCodeQuery) {
    const searchCriteria: FilterToFindWithSearch =
      FilterToFindFactory.createFilterWithSearch({
        uuid: `.*${findCodeQuery.uuid}.*`,
        type: `.*${findCodeQuery.type}.*`,
      });
    return this.find(searchCriteria, {
      ...findCodeQuery,
    });
  }

  async update(id: string, partialUpdateCode: PartialUpdateCode) {
    const user = await this.codeModel.findById(id);
    if (!user) {
      throw new HttpException('code doesnt exists', HttpStatus.NOT_FOUND);
    }

    user.uuid = partialUpdateCode.uuid ?? user.uuid;
    user.type = partialUpdateCode.type ?? user.type;
    user.eventId = partialUpdateCode.eventId ?? user.eventId;
    user.status = partialUpdateCode.status ?? user.status;

    const updatedUser = await this.codeModel.findByIdAndUpdate(id, user, {
      new: true,
    });
    return this.sanitize(updatedUser);
  }

  async updateByEventId(
    eventId: string,
    partialUpdateCode: PartialUpdateCode,
  ): Promise<number> {
    const user = await this.codeModel.findOne({ eventId });
    if (!user) {
      throw new HttpException(
        'there are no codes associated with the event',
        HttpStatus.NOT_FOUND,
      );
    }

    const updated = await this.codeModel.updateMany(
      { eventId },
      {
        uuid: partialUpdateCode.uuid,
        type: partialUpdateCode.type,
        eventId: partialUpdateCode.eventId,
        status: partialUpdateCode.status,
      },
    );
    return updated.modifiedCount;
  }

  async delete(id: string) {
    const user = await this.codeModel.findById(id);
    if (!user) {
      throw new HttpException('user doesnt exists', HttpStatus.NOT_FOUND);
    }

    await this.codeModel.findByIdAndUpdate(id, {
      status: CodeStatusType.DELETED,
    });
  }

  private sanitize(code: CodeModel) {
    const sanitized = code.toObject();
    // delete sanitized['password'];
    return sanitized;
  }
}
