import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
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
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Upload files',
    description: 'Upload one or more image files. Maximum 10 files per request, 5MB per file.' 
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Files uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        filenames: {
          type: 'array',
          items: { type: 'string' },
          example: ['1690123456789-image1.jpg', '1690123456790-image2.jpg']
        },
        message: {
          type: 'string',
          example: 'Files uploaded successfully'
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid file type or size' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload image files',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Image files to upload (JPEG, PNG, GIF, WebP)',
        },
      },
      required: ['files'],
    },
  })
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new Error('No files provided');
    }

    const filenames = await Promise.all(
      files.map((file) => this.uploadsService.handleFileUpload(file)),
    );

    return {
      filenames,
      message: 'Files uploaded successfully',
    };
  }
}
