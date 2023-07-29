import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GuestController } from './guest.controller';
import { GuestService } from './guest.service';
import { GUEST_MODEL_NAME, GuestSchema } from './schemas/guest.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: GUEST_MODEL_NAME,
        schema: GuestSchema,
      },
    ]),
  ],
  providers: [GuestService],
  controllers: [GuestController],
  exports: [GuestService],
})
export class GuestModule {}
