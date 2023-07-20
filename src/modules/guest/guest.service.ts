import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

import { PaginatedParams, PaginatedQueryBase } from 'src/libs/ddd/query.base';
import {
  SearchFilters,
  FilterToFindFactory,
  FilterToFindWithSearch,
  Paginated,
} from 'src/libs/ports/repository.port';

import { CreateGuestDto } from './dto/create-guest.dto';
import { GuestModelName, GuestModel } from './schemas/guest.schema';
import { GuestStatusType } from './types/guest-status.type';

export class FindGuestQuery extends PaginatedQueryBase {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly documentNumber?: string;
  readonly status?: string;

  constructor(props: PaginatedParams<FindGuestQuery>) {
    super(props);
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.documentNumber = props.documentNumber;
    this.status = props.status;
  }
}

export class PartialUpdateGuest {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly phone?: string;
  readonly email?: string;
  readonly documentNumber?: string;
  readonly status?: string;

  constructor(props: PartialUpdateGuest) {
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.phone = props.phone;
    this.email = props.email;
    this.documentNumber = props.documentNumber;
    this.status = props.status;
  }
}

@Injectable()
export class GuestService {
  constructor(
    @InjectModel(GuestModelName) private guestModel: PaginateModel<GuestModel>,
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

  async find(
    filters: SearchFilters | FilterToFindWithSearch,
    paginatedQueryBase: PaginatedQueryBase,
  ) {
    const result = await this.guestModel.paginate(
      { ...filters },
      {
        limit: paginatedQueryBase.limit,
        offset: paginatedQueryBase.offset,
        page: paginatedQueryBase.page,
        sort: paginatedQueryBase.orderBy,
      },
    );

    return new Paginated({
      data: result.docs.map((guest) => this.sanitize(guest)),
      count: result.totalDocs,
      limit: result.limit,
      page: result.page,
    });
  }

  async findWithExact(findGuestQuery: FindGuestQuery) {
    return this.find(
      {
        firstName: findGuestQuery.firstName,
        lastName: findGuestQuery.lastName,
        documentNumber: findGuestQuery.documentNumber,
        status: findGuestQuery.status,
      },
      { ...findGuestQuery },
    );
  }

  async findWithSearch(findGuestQuery: FindGuestQuery) {
    const searchCriteria: FilterToFindWithSearch =
      FilterToFindFactory.createFilterWithSearch({
        firstName: `.*${findGuestQuery.firstName}.*`,
        lastName: `.*${findGuestQuery.lastName}.*`,
        documentNumber: `.*${findGuestQuery.documentNumber}.*`,
      });
    return this.find(searchCriteria, {
      ...findGuestQuery,
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
    guest.status = partialUpdateGuest.status ?? guest.status;

    const updatedGuest = await this.guestModel.findByIdAndUpdate(id, guest, {
      new: true,
    });
    return this.sanitize(updatedGuest);
  }

  async delete(id: string) {
    const guest = await this.guestModel.findById(id);
    if (!guest) {
      throw new HttpException('guest doesnt exists', HttpStatus.NOT_FOUND);
    }

    await this.guestModel.findByIdAndUpdate(id, {
      status: GuestStatusType.DELETED,
    });
  }

  private sanitize(guest: GuestModel) {
    const sanitized = guest.toObject();
    delete sanitized['password'];
    return sanitized;
  }
}
