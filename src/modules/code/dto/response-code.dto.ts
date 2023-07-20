import { ApiProperty } from '@nestjs/swagger';
import { EntityBaseResponse } from 'src/libs/api/responses/entity-base.response';
import { CodeTypesType } from '../types/code-types.type';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { CodeStatusType } from '../types/code-status.type';

export class ResponseCodeDto extends EntityBaseResponse {
  @ApiProperty({
    example: '234534',
    description: 'data to generate code',
  })
  uuid: string;

  @ApiProperty({
    example: CodeTypesType.QR,
    description: `type of code ${Object.values(CodeTypesType).join('||')}`,
  })
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
  status?: CodeStatusType;
}
