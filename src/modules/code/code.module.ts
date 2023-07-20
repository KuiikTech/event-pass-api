import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CodeService } from './code.service';
import { CodeModelName, CodeSchema } from './schemas/code.schema';

import { EventModule } from '../event/event.module';
import { CodeController } from './code.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CodeModelName,
        schema: CodeSchema,
      },
    ]),
    EventModule,
  ],
  providers: [CodeService],
  controllers: [CodeController],
})
export class CodeModule {}
