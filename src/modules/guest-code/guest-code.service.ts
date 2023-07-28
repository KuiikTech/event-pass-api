import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

import { CustomValidationException } from 'src/libs/exceptions/http.exception';

import {
  GuestCodeModel,
  GuestCodeModelName,
} from './schemas/guest-code.schema';
import { CreateGuestCodeDto } from './dto/create-guest-code.dto';
import { EventService } from '../event/event.service';
import { GuestService } from '../guest/guest.service';
import { CodeService } from '../code/code.service';
import { GuestCodeStatusType } from './types/guest-code-status.type';

export class PartialUpdateGuestCode {
  readonly eventId?: string;
  readonly guestId?: string;
  readonly codeId?: string;
  readonly initialAmount?: number;
  readonly count?: number;
  readonly status?: GuestCodeStatusType;

  constructor(props: PartialUpdateGuestCode) {
    this.eventId = props.eventId;
    this.guestId = props.guestId;
    this.codeId = props.codeId;
    this.initialAmount = props.initialAmount;
    this.count = props.count;
    this.status = props.status;
  }
}

@Injectable()
export class GuestCodeService {
  constructor(
    @InjectModel(GuestCodeModelName)
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

  async update(
    idOrUuid: string,
    partialUpdateGuestCode: PartialUpdateGuestCode,
    searchById = true,
  ) {
    let query;
    if (!searchById) {
      const code = await this.codeService.findOne({
        uuid: idOrUuid,
      });
      query = { codeId: code._id };
    }
    console.log(!query ? { _id: idOrUuid } : query);
    console.log(!!query ? { _id: idOrUuid } : query);
    const guestCode = await this.guestCodeModel.findOne(
      !query ? { _id: idOrUuid } : query,
    );
    if (!guestCode) {
      throw new HttpException(
        'Guest code does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const { eventId, guestId, codeId, initialAmount, count, status } =
      partialUpdateGuestCode;

    guestCode.eventId = eventId ?? guestCode.eventId;
    guestCode.guestId = guestId ?? guestCode.guestId;
    guestCode.codeId = codeId ?? guestCode.codeId;
    guestCode.initialAmount = initialAmount ?? guestCode.initialAmount;
    guestCode.count = count ?? guestCode.count;
    guestCode.status = status ?? guestCode.status;

    const updatedGuestCode = await this.guestCodeModel.findByIdAndUpdate(
      guestCode._id,
      guestCode,
      { new: true },
    );
    return this.sanitize(updatedGuestCode);
  }

  updatedGuestCodeById(
    id: string,
    partialUpdateGuestCode: PartialUpdateGuestCode,
  ) {
    return this.update(id, partialUpdateGuestCode);
  }

  updatedGuestCodeByUuid(
    uuid: string,
    partialUpdateGuestCode: PartialUpdateGuestCode,
  ) {
    return this.update(uuid, partialUpdateGuestCode, false);
  }

  private sanitize(guestCode: GuestCodeModel) {
    const sanitized = guestCode.toObject();
    // delete sanitized['password'];
    return sanitized;
  }
}
