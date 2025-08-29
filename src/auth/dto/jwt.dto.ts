import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Trim } from 'src/decorators/trim.decorator';

export class JwtDTO {
  @ApiProperty({ example: 'jwt token' })
  @IsNotEmpty()
  @IsString()
  @Trim()
  jwt: string;
}
