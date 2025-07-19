import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ description: 'Username or email for login' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Password for login' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
