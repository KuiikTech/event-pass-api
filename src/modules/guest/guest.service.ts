import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

import { PaginatedParams, PaginatedQueryBase } from 'src/libs/ddd/query.base';
import { Paginated } from 'src/libs/ports/repository.port';

import { CreateGuestDto } from './dto/create-guest.dto';
import { GuestModel } from './schemas/guest.schema';

export class FindGuestQuery extends PaginatedQueryBase {
  readonly firstName?: string;
  readonly lastname?: string;
  readonly documentNumber?: string;

  constructor(props: PaginatedParams<FindGuestQuery>) {
    super(props);
    this.firstName = props.firstName;
    this.lastname = props.lastname;
    this.documentNumber = props.documentNumber;
  }
}

export class PartialUpdateGuest {
  readonly firstName?: string;

  readonly lastName?: string;

  readonly phone?: string;

  readonly email?: string;

  readonly documentNumber?: string;

  constructor(props: PartialUpdateGuest) {
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.phone = props.phone;
    this.email = props.email;
    this.documentNumber = props.documentNumber;
  }
}

@Injectable()
export class GuestService {
  constructor(
    @InjectModel('Guest') private guestModel: PaginateModel<GuestModel>,
  ) {}

  async create(createGuestDto: CreateGuestDto) {
    const { email } = createGuestDto;
    const guest = await this.guestModel.findOne({ email });
    if (guest) {
      throw new HttpException('guest already exists', HttpStatus.BAD_REQUEST);
    }
    const createdGuest = new this.guestModel(createGuestDto);
    await createdGuest.save();
  }

  async find(findGuestQuery: FindGuestQuery) {
    const filters = {
      firstName: findGuestQuery.firstName,
      lastName: findGuestQuery.lastname,
      documentNumber: findGuestQuery.documentNumber,
    };
    const result = await this.guestModel.paginate(
      { ...filters },
      {
        limit: findGuestQuery.limit,
        offset: findGuestQuery.offset,
        page: findGuestQuery.page,
        sort: findGuestQuery.orderBy,
      },
    );

    return new Paginated({
      data: result.docs.map((guest) => this.sanitize(guest)),
      count: result.totalDocs,
      limit: result.limit,
      page: result.page,
    });
  }

  async findById(id: string) {
    const guest = await this.guestModel.findById(id);
    if (!guest) {
      throw new HttpException('guest doesnt exists', HttpStatus.BAD_REQUEST);
    }
    return this.sanitize(guest);
  }

  async update(id: string, partialUpdateGuest: PartialUpdateGuest) {
    const guest = await this.guestModel.findById(id);
    if (!guest) {
      throw new HttpException('guest doesnt exists', HttpStatus.NOT_FOUND);
    }

    guest.firstName = partialUpdateGuest.firstName ?? guest.firstName;
    guest.lastName = partialUpdateGuest.lastName ?? guest.lastName;
    guest.phone = partialUpdateGuest.phone ?? guest.phone;
    guest.email = partialUpdateGuest.email ?? guest.email;
    guest.documentNumber =
      partialUpdateGuest.documentNumber ?? guest.documentNumber;

    const updatedGuest = await this.guestModel.findByIdAndUpdate(id, guest, {
      new: true,
    });
    return this.sanitize(updatedGuest);
  }

  private sanitize(guest: GuestModel) {
    const sanitized = guest.toObject();
    delete sanitized['password'];
    return sanitized;
  }
}
