import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  GuestCodeModelName,
  GuestCodeSchema,
} from './schemas/guest-code.schema';
import { GuestCodeService } from './guest-code.service';
import { EventModule } from '../event/event.module';
import { GuestModule } from '../guest/guest.module';
import { CodeModule } from '../code/code.module';
import { GuestCodeController } from './guest-code.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: GuestCodeModelName,
        schema: GuestCodeSchema,
      },
    ]),
    EventModule,
    GuestModule,
    CodeModule,
  ],
  providers: [GuestCodeService],
  controllers: [GuestCodeController],
})
export class GuestCodeModule {}
