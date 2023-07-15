import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GuestController } from './guest.controller';
import { GuestService } from './guest.service';
import { GuestSchema } from './schemas/guest.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Guest',
        schema: GuestSchema,
      },
    ]),
  ],
  providers: [GuestService],
  controllers: [GuestController],
})
export class GuestModule {}
