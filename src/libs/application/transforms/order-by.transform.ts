import { BadRequestException as BadRequestHttpException } from '@nestjs/common';
import { TransformFnParams } from 'class-transformer';
import { OrderByOptions } from 'src/libs/ddd/query.base';

export const OrderByTransform = ({ value, key: field }: TransformFnParams) => {
  let jsonValue = {};
  try {
    jsonValue = JSON.parse(value);
  } catch (e) {
    throw new BadRequestHttpException([
      `Error validating ${field}, not a valid JSON`,
    ]);
  }

  for (const key in jsonValue) {
    if (
      typeof key !== 'string' ||
      !Object.values(OrderByOptions).includes(jsonValue[key])
    ) {
      throw new BadRequestHttpException([
        `Error validating ${field}, the key ${key} is not of the supported type ${JSON.stringify(
          OrderByOptions,
        ).replaceAll('"', "'")}`,
      ]);
    }
  }
  return jsonValue;
};
