import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class FilterEventDto {
  @ApiProperty({
    description: 'Search term for event title or description',
    example: 'music festival',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'Category filter',
    example: 'Music',
    required: false,
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    description: 'Start date filter (events after this date)',
    example: '2024-07-01T00:00:00Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    description: 'End date filter (events before this date)',
    example: '2024-12-31T23:59:59Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({
    description: 'Minimum number of guests',
    example: 50,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  minGuests?: number;

  @ApiProperty({
    description: 'Maximum number of guests',
    example: 200,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  maxGuests?: number;

  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;

  @ApiProperty({
    description: 'Sort field',
    example: 'startDate',
    enum: [
      'title',
      'startDate',
      'endDate',
      'totalGuests',
      'category',
      'createdAt',
    ],
    required: false,
  })
  @IsString()
  @IsOptional()
  sortBy?: string = 'startDate';

  @ApiProperty({
    description: 'Sort order',
    example: 'ASC',
    enum: ['ASC', 'DESC'],
    default: 'ASC',
    required: false,
  })
  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}
