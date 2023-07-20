import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidV4 } from 'uuid';
import { PaginateModel } from 'mongoose';

import { CodeModel, CodeModelName } from './schemas/code.schema';
import { CreateManyCodesDto } from './dto/create-many-codes.dto';

import { EventService } from '../event/event.service';

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

    const codes = Array.from({ length: amount }).map(() => ({
      uuid: uuidV4(),
      type,
      eventId,
    }));

    return (await this.codeModel.insertMany(codes)).map((code) =>
      this.sanitize(code),
    );
  }

  private sanitize(code: CodeModel) {
    const sanitized = code.toObject();
    // delete sanitized['password'];
    return sanitized;
  }
}
