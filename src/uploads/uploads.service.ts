import { Injectable, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import * as fs from 'fs';

@Injectable()
export class UploadsService {
  private readonly uploadPath = join(__dirname, '..', '..', 'uploads');
  private readonly tempUploadPath = join(__dirname, '..', '..', 'temp-uploads');
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ];
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB

  constructor() {
    this.createUploadFolders();
  }

  private createUploadFolders() {
    if (!existsSync(this.uploadPath)) {
      mkdirSync(this.uploadPath, { recursive: true });
    }
    if (!existsSync(this.tempUploadPath)) {
      mkdirSync(this.tempUploadPath, { recursive: true });
    }
  }

  async handleFileUpload(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type ${
          file.mimetype
        } is not allowed. Allowed types: ${this.allowedMimeTypes.join(', ')}`,
      );
    }

    // Validate file size
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size ${file.size} bytes exceeds maximum allowed size of ${this.maxFileSize} bytes`,
      );
    }

    const uniqueFileName = `${uuidv4()}-${file.originalname}`;
    const filePath = join(this.uploadPath, uniqueFileName);

    try {
      // Handle both buffer (memory storage) and file path (disk storage)
      if (file.buffer) {
        // File is in memory, write buffer to disk
        await this.writeBufferToFile(file.buffer, filePath);
      } else if (file.path) {
        // File is on disk, move it to uploads directory
        await this.moveFile(file.path, filePath);
      } else {
        throw new Error('File has neither buffer nor path');
      }
      
      return uniqueFileName;
    } catch (error) {
      // Clean up the temporary file if move fails
      if (file.path && existsSync(file.path)) {
        unlinkSync(file.path);
      }
      throw new BadRequestException('Failed to upload file: ' + error.message);
    }
  }

  private moveFile(source: string, destination: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(source);
      const writeStream = fs.createWriteStream(destination);

      readStream.pipe(writeStream);

      readStream.on('error', (error) => {
        reject(error);
      });

      writeStream.on('error', (error) => {
        reject(error);
      });

      writeStream.on('finish', () => {
        // Remove the temporary file
        if (existsSync(source)) {
          unlinkSync(source);
        }
        resolve();
      });
    });
  }

  private writeBufferToFile(buffer: Buffer, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, buffer, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  getFilePath(fileName: string): string {
    return join(this.uploadPath, fileName);
  }

  deleteFile(fileName: string): boolean {
    const filePath = this.getFilePath(fileName);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
      return true;
    }
    return false;
  }

  getFileUrl(fileName: string): string {
    return `/uploads/${fileName}`;
  }
}
