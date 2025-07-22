import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsOptional,
  IsArray,
  Min,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({
    description: 'Title of the event',
    example: 'Summer Music Festival',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'Description of the event',
    example: 'A wonderful summer music festival with live performances',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Start date and time of the event',
    example: '2024-07-15T18:00:00Z',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'End date and time of the event',
    example: '2024-07-15T22:00:00Z',
  })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    description: 'Total number of guests expected',
    example: 100,
    minimum: 1,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? value : parsed;
    }
    return value;
  })
  @IsNumber()
  @Min(1)
  totalGuests: number;

  @ApiProperty({
    description: 'Category of the event',
    example: 'Music',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  category: string;

  @ApiProperty({
    description: 'Location of the event',
    example: 'Central Park, New York',
    required: false,
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({
    description: 'Price of the event ticket',
    example: 50.0,
    required: false,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? value : parsed;
    }
    return value;
  })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'Array of image URLs',
    example: ['image1.jpg', 'image2.jpg'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  images?: string[];
}
