import { Schema } from 'mongoose';
import { GuestCodeStatusType } from 'src/modules/guest-code/types/guest-code-status.type';

const defaultFilterMiddleware = function (next) {
  if (!this.getQuery().status) {
    this.where({ status: { $ne: GuestCodeStatusType.DELETED } });
  }

  return next();
};

const applyDefaultFilterMiddleware = (schema: Schema) => {
  schema.pre('find', defaultFilterMiddleware);
  schema.pre('findOne', defaultFilterMiddleware);
};

export default applyDefaultFilterMiddleware;
