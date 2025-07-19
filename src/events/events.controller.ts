import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Request,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FilterEventDto } from './dto/filter-event.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UploadsService } from '../uploads/uploads.service';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly uploadsService: UploadsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({ status: 201, description: 'Event created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Summer Concert' },
        description: { type: 'string', example: 'A wonderful summer concert' },
        startDate: {
          type: 'string',
          format: 'date-time',
          example: '2024-07-15T18:00:00Z',
        },
        endDate: {
          type: 'string',
          format: 'date-time',
          example: '2024-07-15T22:00:00Z',
        },
        totalGuests: { type: 'number', example: 100 },
        category: { type: 'string', example: 'Music' },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
      required: ['title', 'startDate', 'endDate'],
    },
  })
  async create(
    @Body() createEventDto: CreateEventDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req: any,
  ) {
    let imageUrls: string[] = [];

    if (files && files.length > 0) {
      imageUrls = await Promise.all(
        files.map((file) => this.uploadsService.handleFileUpload(file)),
      );
    }

    const eventData = {
      ...createEventDto,
      images: imageUrls,
    };

    return this.eventsService.create(eventData, req.user.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all events with filtering, pagination, and sorting',
  })
  @ApiResponse({ status: 200, description: 'Events retrieved successfully' })
  findAll(@Query() filterEventDto: FilterEventDto) {
    return this.eventsService.findAll(filterEventDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific event by ID' })
  @ApiResponse({ status: 200, description: 'Event retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an event' })
  @ApiResponse({ status: 200, description: 'Event updated successfully' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the event owner' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Updated Summer Concert' },
        description: { type: 'string', example: 'Updated description' },
        startDate: {
          type: 'string',
          format: 'date-time',
          example: '2024-07-15T18:00:00Z',
        },
        endDate: {
          type: 'string',
          format: 'date-time',
          example: '2024-07-15T22:00:00Z',
        },
        totalGuests: { type: 'number', example: 150 },
        category: { type: 'string', example: 'Music' },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req: any,
  ) {
    let imageUrls: string[] = [];

    if (files && files.length > 0) {
      imageUrls = await Promise.all(
        files.map((file) => this.uploadsService.handleFileUpload(file)),
      );
    }

    const eventData = {
      ...updateEventDto,
      ...(imageUrls.length > 0 && { images: imageUrls }),
    };

    return this.eventsService.update(+id, eventData, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an event' })
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the event owner' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.eventsService.remove(+id, req.user.id);
  }
}
