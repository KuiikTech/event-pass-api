import { ApiProperty } from '@nestjs/swagger';
import { ResponseUserDto } from 'src/modules/user/dto/response-user.dto';

export class ResponseLoginDto {
  @ApiProperty({
    description: 'user information',
  })
  user: ResponseUserDto;

  @ApiProperty({
    description: 'access token for user created',
  })
  token: string;
}
