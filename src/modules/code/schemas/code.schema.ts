import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

import { EventModelName } from 'src/modules/event/schemas/event.schema';

import { CodeTypesType } from '../types/code-types.type';
import { CodeStatusType } from '../types/code-status.type';

export const CodeModelName = 'Code';

@Schema({
  timestamps: true,
})
export class CodeModel extends Document {
  @Prop({
    type: String,
    required: true,
  })
  uuid: string;

  @Prop({
    type: String,
    required: true,
    enum: CodeTypesType,
    default: CodeTypesType.BAR,
  })
  type: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: EventModelName,
    required: true,
  })
  eventId: string;

  @Prop({
    type: String,
    required: true,
    enum: CodeStatusType,
    default: CodeStatusType.CREATED,
  })
  status: string;
}

export const CodeSchema = SchemaFactory.createForClass(CodeModel);
