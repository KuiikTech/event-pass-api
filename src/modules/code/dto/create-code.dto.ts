import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { CodeTypesType } from '../types/code-types.type';
import { CodeStatusType } from '../types/code-status.type';

export class CreateCodeDto {
  @ApiProperty({
    example: '234534',
    description: 'uuid v4 to generate code',
  })
  @IsOptional()
  @IsString()
  @IsUUID('4')
  uuid?: string;

  @ApiProperty({
    example: CodeTypesType.QR,
    description: `type of code ${Object.values(CodeTypesType).join('||')}`,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(CodeTypesType)
  type: string;

  @ApiProperty({
    example: '64b74abdb8d0fb6b13b4f299',
    description: 'event id to relate the codes',
  })
  @IsNotEmpty()
  @IsMongoId()
  eventId: string;

  @ApiProperty({
    example: CodeStatusType.CREATED,
    description: `status of the code: ${Object.values(CodeStatusType).join(
      '||',
    )}`,
    default: CodeStatusType.CREATED,
  })
  @IsOptional()
  @IsIn(Object.values(CodeStatusType))
  status?: CodeStatusType;
}
