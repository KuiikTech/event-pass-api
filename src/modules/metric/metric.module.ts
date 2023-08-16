import { Module } from '@nestjs/common';

import { MetricService } from './metric.service';
import { EventModule } from '../event/event.module';
import { GuestCodeModule } from '../guest-code/guest-code.module';
import { MetricController } from './metric.controller';

@Module({
  imports: [EventModule, GuestCodeModule],
  providers: [MetricService],
  controllers: [MetricController],
})
export class MetricModule {}
