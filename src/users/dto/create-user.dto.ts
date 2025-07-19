import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Username for the user',
    example: 'john_doe',
  })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({
    description: 'Email address for the user',
    example: 'john@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password for the user (minimum 8 characters)',
    example: 'SecurePass123!',
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
    required: false,
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  lastName?: string;
}
