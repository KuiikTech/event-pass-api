import { ApiProperty } from '@nestjs/swagger';
import { IdResponse } from './id.response';

export interface EntityBaseResponseProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export class EntityBaseResponse extends IdResponse {
  constructor(props: EntityBaseResponseProps) {
    super(props.id);
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  @ApiProperty({ example: '2020-11-24T17:43:15.970Z' })
  readonly createdAt: Date;

  @ApiProperty({ example: '2020-11-24T17:43:15.970Z' })
  readonly updatedAt: Date;
}
