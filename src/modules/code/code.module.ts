import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CodeService } from './code.service';
import { CODE_MODEL_NAME, CodeSchema } from './schemas/code.schema';

import { EventModule } from '../event/event.module';
import { CodeController } from './code.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CODE_MODEL_NAME,
        schema: CodeSchema,
      },
    ]),
    EventModule,
  ],
  providers: [CodeService],
  controllers: [CodeController],
  exports: [CodeService],
})
export class CodeModule {}
