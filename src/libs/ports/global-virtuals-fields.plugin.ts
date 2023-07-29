import { Schema } from 'mongoose';

export function GlobalVirtualFields(schema: Schema) {
  // Define global virtual fields here, example:
  // schema.virtual('fullName').get(function () {
  //   return `${this.firstName} ${this.lastName}`;
  // });

  // Activar virtual fields in toObject y toJSON
  schema.set('toObject', {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
      delete ret._id;
    },
  });
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
      delete ret._id;
    },
  });
}
