import { Injectable } from '@nestjs/common';

import { EventService } from '../event/event.service';
import { ResponseTotalEventMetricsDto } from './dto/response-event-metrics.dto';

@Injectable()
export class MetricService {
  constructor(private eventService: EventService) {}

  async getTotalizedEventMetrics(): Promise<ResponseTotalEventMetricsDto> {
    const totalEventsCounts = await this.eventService.getEventCounts();
    const totalEventsCountByCity =
      await this.eventService.getEventMetricsByCity();

    return {
      ...totalEventsCounts,
      byCity: totalEventsCountByCity,
    };
  }
}
