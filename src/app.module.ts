import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import * as mongooseUniqueValidator from 'mongoose-unique-validator';
import * as mongooseValidationErrorTransform from 'mongoose-validation-error-transform';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { AuthService } from './modules/auth/auth.service';
import { JwtStrategy } from './modules/auth/strategies/jwt.strategy';
import { UserModule } from './modules/user/user.module';
import { LoggerMiddleware } from './libs/application/middlewares/logger.middleware';
import { GuestModule } from './modules/guest/guest.module';

import 'reflect-metadata';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      ignoreUndefined: true,
      connectionFactory: (connection) => {
        connection.plugin(mongoosePaginate);
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
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, JwtStrategy],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
