import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CorrelationIdMiddleware,
  CorrelationModule,
} from '@evanion/nestjs-correlation-id';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import * as mongooseUniqueValidator from 'mongoose-unique-validator';
import * as mongooseValidationErrorTransform from 'mongoose-validation-error-transform';
import { MongooseFindByReference } from 'mongoose-find-by-reference';
import { v4 as uuidV4 } from 'uuid';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { AuthService } from './modules/auth/auth.service';
import { JwtStrategy } from './modules/auth/strategies/jwt.strategy';
import { UserModule } from './modules/user/user.module';
import { LoggerMiddleware } from './libs/application/middlewares/logger.middleware';
import { GuestModule } from './modules/guest/guest.module';
import { EventModule } from './modules/event/event.module';
import { CodeModule } from './modules/code/code.module';
import { GuestCodeModule } from './modules/guest-code/guest-code.module';
import { GlobalVirtualFields } from './libs/ports/global-virtuals-fields.plugin';

import 'reflect-metadata';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CorrelationModule.forRoot({
      header: 'X-Request-ID',
      generator: () => uuidV4(),
    }),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      ignoreUndefined: true,
      connectionFactory: (connection) => {
        connection.plugin(mongoosePaginate);
        connection.plugin(GlobalVirtualFields);
        connection.plugin(MongooseFindByReference);
        connection.plugin(mongooseUniqueValidator);
        connection.plugin(mongooseValidationErrorTransform, {
          humanize: false,
        });
        return connection;
      },
    }),
    UserModule,
    AuthModule,
    GuestModule,
    EventModule,
    CodeModule,
    GuestCodeModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy, AuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorrelationIdMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
