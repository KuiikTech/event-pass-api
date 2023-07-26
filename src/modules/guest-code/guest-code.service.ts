import { Injectable, HttpStatus } from '@nestjs/common';
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

  private sanitize(guestCode: GuestCodeModel) {
    const sanitized = guestCode.toObject();
    // delete sanitized['password'];
    return sanitized;
  }
}
