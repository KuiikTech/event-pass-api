import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { PayloadEntity } from 'src/modules/auth/entities/payload.entity';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { RolesType } from 'src/modules/auth/types/roles.types';
import { PaginatedParams, PaginatedQueryBase } from 'src/libs/ddd/query.base';
import {
  SearchFilters,
  FilterToFindWithSearch,
  FilterToFindFactory,
  Paginated,
} from 'src/libs/ports/repository.port';

import { USER_MODEL_NAME, UserModel } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserStatusType } from './types/user-status.type';

export class FindUserQuery extends PaginatedQueryBase {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly email?: string;
  readonly status?: string;

  constructor(props: PaginatedParams<FindUserQuery>) {
    super(props);
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.email = props.email;
    this.status = props.status;
  }
}

export class PartialUpdateUser {
  readonly firstName?: string;

  readonly lastName?: string;

  readonly phone?: string;

  readonly email?: string;

  readonly password?: string;

  readonly roles?: string[];

  readonly status?: UserStatusType;

  constructor(props: PartialUpdateUser) {
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.phone = props.phone;
    this.email = props.email;
    this.password = props.password;
    this.roles = props.roles;
    this.status = props.status;
  }
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_MODEL_NAME) private userModel: PaginateModel<UserModel>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const user = await this.userModel.findOne({ email });

    if (user) {
      throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
    }

    let roles = createUserDto.roles;
    if (!roles || roles.length === 0) {
      roles = [RolesType.GUEST];
    }

    let status = createUserDto.status;
    if (
      !status ||
      !Object.values(UserStatusType).includes(createUserDto.status)
    ) {
      status = UserStatusType.ACTIVE;
    }

    const createdUser = new this.userModel({
      ...createUserDto,
      roles,
      status,
    });
    await createdUser.save();

    return this.sanitize(createdUser);
  }

  async findByLogin(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
    }
    if (await bcrypt.compare(password, user.password)) {
      return this.sanitize(user);
    } else {
      throw new HttpException('invalid credential', HttpStatus.BAD_REQUEST);
    }
  }

  async findByPayload(payload: PayloadEntity) {
    const { id } = payload;
    const user = await this.userModel.findById(id);
    return this.sanitize(user);
  }

  async find(
    filters: SearchFilters | FilterToFindWithSearch,
    paginatedQueryBase: PaginatedQueryBase,
  ) {
    const result = await this.userModel.paginate(
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

  async searchExact(findUserQuery: FindUserQuery) {
    return this.find(
      {
        firstName: findUserQuery.firstName,
        lastName: findUserQuery.lastName,
        email: findUserQuery.email,
        status: findUserQuery.status,
      },
      { ...findUserQuery },
    );
  }

  async search(findUserQuery: FindUserQuery) {
    const searchCriteria: FilterToFindWithSearch =
      FilterToFindFactory.createFilterWithSearch({
        firstName: `.*${findUserQuery.firstName}.*`,
        lastName: `.*${findUserQuery.lastName}.*`,
        email: `.*${findUserQuery.email}.*`,
      });
    return this.find(searchCriteria, {
      ...findUserQuery,
    });
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
    }
    return this.sanitize(user);
  }

  async update(id: string, partialUpdateUser: PartialUpdateUser) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new HttpException('user doesnt exists', HttpStatus.NOT_FOUND);
    }

    user.set({ ...partialUpdateUser });

    const updatedUser = await this.userModel.findByIdAndUpdate(id, user, {
      new: true,
    });
    return this.sanitize(updatedUser);
  }

  async delete(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new HttpException('user doesnt exists', HttpStatus.NOT_FOUND);
    }

    await this.userModel.findByIdAndUpdate(id, {
      status: UserStatusType.DELETED,
    });
  }

  private sanitize(user: UserModel) {
    const sanitized = user.toObject();
    delete sanitized['password'];
    return sanitized;
  }
}
