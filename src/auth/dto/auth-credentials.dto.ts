import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsDto {
  @ApiProperty({ description: 'Username of the user' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Email address of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Password for the user account' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
