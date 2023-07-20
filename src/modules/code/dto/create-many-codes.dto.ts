import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { CodeTypesType } from '../types/code-types.type';

export class CreateManyCodesDto {
  @ApiProperty({
    example: CodeTypesType.QR,
    description: `type of code ${Object.values(CodeTypesType).join('||')}`,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(CodeTypesType)
  type: string;

  @ApiProperty({
    example: 10,
    description: 'number of codes to create',
  })
  @IsNotEmpty()
  @Max(1000)
  @Min(1)
  amount: number;

  @ApiProperty({
    example: '64b74abdb8d0fb6b13b4f299',
    description: 'event id to relate the codes',
  })
  @IsNotEmpty()
  @IsMongoId()
  eventId: string;
}
