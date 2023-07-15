import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateGuestDto } from './dto/create-guest.dto';
import { Guest } from './schemas/guest.schema';

@Injectable()
export class GuestService {
  constructor(@InjectModel('Guest') private guestModel: Model<Guest>) {}

  async create(createGuestDto: CreateGuestDto) {
    const { email } = createGuestDto;
    const guest = await this.guestModel.findOne({ email });
    if (guest) {
      throw new HttpException('guest already exists', HttpStatus.BAD_REQUEST);
    }
    const createdGuest = new this.guestModel(createGuestDto);
    await createdGuest.save();
  }
}
