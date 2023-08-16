import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { routesV1 } from 'src/app.routes';
import { ErrorResponse } from 'src/libs/api/responses/error.response';
import { MetricService } from './metric.service';

@ApiTags(`/${routesV1.metrics.root}`)
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({ version: routesV1.version })
export class MetricController {
  constructor(private metricService: MetricService) {}

  @ApiOperation({ summary: 'Get totalized event metrics' })
  @ApiBadRequestResponse({ type: ErrorResponse })
  @Get(routesV1.metrics.eventMetrics)
  async getEventMetrics() {
    return this.metricService.getTotalizedEventMetrics();
  }
}
