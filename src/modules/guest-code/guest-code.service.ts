import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

import { CustomValidationException } from 'src/libs/exceptions/http.exception';
import { PaginatedParams, PaginatedQueryBase } from 'src/libs/ddd/query.base';

import {
  GuestCodeModel,
  GUEST_CODE_MODEL_NAME,
} from './schemas/guest-code.schema';
import { CreateGuestCodeDto } from './dto/create-guest-code.dto';
import { EventService } from '../event/event.service';
import { GuestService } from '../guest/guest.service';
import { CodeService } from '../code/code.service';
import { GuestCodeStatusType } from './types/guest-code-status.type';
import {
  FilterToFindWithSearchRegex,
  Paginated,
  SearchFilters,
} from 'src/libs/ports/repository.port';

export class FindGuestCodeQuery extends PaginatedQueryBase {
  readonly eventId?: string;
  readonly guestId?: string;
  readonly codeId?: string;
  readonly initialAmount?: number;
  readonly count?: number;
  readonly status?: string;

  constructor(props: PaginatedParams<FindGuestCodeQuery>) {
    super(props);
    this.eventId = props.eventId;
    this.guestId = props.guestId;
    this.codeId = props.codeId;
    this.initialAmount = props.initialAmount;
    this.count = props.count;
    this.status = props.status;
  }
}

export class PartialUpdateGuestCode {
  eventId?: string;
  guestId?: string;
  codeId?: string;
  initialAmount?: number;
  count?: number;
  status?: GuestCodeStatusType;
}

@Injectable()
export class GuestCodeService {
  constructor(
    @InjectModel(GUEST_CODE_MODEL_NAME)
    private guestCodeModel: PaginateModel<GuestCodeModel>,
    private eventService: EventService,
    private guestService: GuestService,
    private codeService: CodeService,
  ) {}

  async create(createGuestCodeDto: CreateGuestCodeDto) {
    const { eventId, guestId, codeId } = createGuestCodeDto;

    const errors: string[] = [];
    const event = await this.eventService.findById(eventId);
    if (!event) {
      errors.push(`event with the provided id [${eventId}] does not exist`);
    }
    const guest = await this.guestService.findById(guestId);
    if (!guest) {
      errors.push(`guest with the provided id [${guestId}] does not exist`);
    }
    const code = await this.codeService.findById(codeId);
    if (!code) {
      errors.push(`code with the provided id [${codeId}] does not exist`);
    }

    if (errors.length > 0) {
      throw new CustomValidationException(errors, HttpStatus.BAD_REQUEST);
    }

    const createdUser = new this.guestCodeModel({
      ...createGuestCodeDto,
    });
    await createdUser.save();

    return this.sanitize(createdUser);
  }

  async updateById(id: string, partialUpdateGuestCode: PartialUpdateGuestCode) {
    const guestCode = await this.guestCodeModel.findById(id);
    if (!guestCode) {
      throw new HttpException(
        'Guest code does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    guestCode.set({
      ...partialUpdateGuestCode,
    });

    const updatedGuestCode = await this.guestCodeModel.findByIdAndUpdate(
      id,
      guestCode,
      { new: true },
    );
    return this.sanitize(updatedGuestCode);
  }

  async updateByUuid(
    uuid: string,
    partialUpdateGuestCode: PartialUpdateGuestCode,
  ) {
    const code = await this.codeService.findOne({ uuid });
    if (!code) {
      throw new HttpException('Code does not exist', HttpStatus.NOT_FOUND);
    }

    const guestCode = await this.guestCodeModel.findOne({ codeId: code.id });
    if (!guestCode) {
      throw new HttpException(
        'Guest code does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    guestCode.set({
      ...partialUpdateGuestCode,
    });

    const updatedGuestCode = await this.guestCodeModel.findByIdAndUpdate(
      guestCode.id,
      guestCode,
      { new: true },
    );
    return this.sanitize(updatedGuestCode);
  }

  async find(
    filters: SearchFilters | FilterToFindWithSearchRegex,
    paginatedQueryBase: PaginatedQueryBase,
  ) {
    console.log(JSON.stringify(filters));

    const result = await this.guestCodeModel.paginate(
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

  async searchExact(findGuestCodeQuery: FindGuestCodeQuery) {
    return this.find(
      {
        eventId: findGuestCodeQuery.eventId,
        guestId: findGuestCodeQuery.guestId,
        codeId: findGuestCodeQuery.codeId,
        initialAmount: findGuestCodeQuery.initialAmount,
        count: findGuestCodeQuery.count,
        status: findGuestCodeQuery.status,
      },
      { ...findGuestCodeQuery },
    );
  }

  async search(findGuestCodeQuery: FindGuestCodeQuery) {
    const searchCriteria = {
      $or: [
        { eventId: findGuestCodeQuery.eventId },
        { guestId: findGuestCodeQuery.guestId },
        { codeId: findGuestCodeQuery.codeId },
      ],
    };
    return this.find(searchCriteria, {
      ...findGuestCodeQuery,
    });
  }

  private sanitize(guestCode: GuestCodeModel) {
    const sanitized = guestCode.toObject();
    // delete sanitized['password'];
    return sanitized;
  }
}
