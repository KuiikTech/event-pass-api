import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { CorrelationService } from '@evanion/nestjs-correlation-id';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  constructor(private readonly correlationService: CorrelationService) {}

  async use(request: Request, response: Response, next: NextFunction) {
    const startAt = process.hrtime();
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    const correlationId = await this.correlationService.getCorrelationId();

    this.logger.log(
      `[${correlationId}] ${method} ${originalUrl} Request started.`,
    );

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const diff = process.hrtime(startAt);
      const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;
      const logString = `[${correlationId}] ${method} ${originalUrl} ${statusCode} ${responseTime}ms ${contentLength} - ${userAgent} ${ip}`;

      if (statusCode >= 400) {
        this.logger.error(logString);
      } else {
        this.logger.log(logString);
      }
    });

    next();
  }
}
