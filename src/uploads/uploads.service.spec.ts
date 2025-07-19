import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');
jest.mock('path');
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'uuid-test'),
}));

describe('UploadsService', () => {
  let service: UploadsService;
  let mockFs: any;
  let mockPath: any;

  const mockFile = {
    originalname: 'test-image.jpg',
    mimetype: 'image/jpeg',
    size: 1024 * 1024, // 1MB
    path: '/tmp/test-file',
  };

  beforeEach(async () => {
    // Mock fs and path modules first
    mockFs = fs as jest.Mocked<typeof fs>;
    mockPath = path as jest.Mocked<typeof path>;

    // Mock path.join before creating the service
    mockPath.join.mockReturnValue('/uploads');

    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadsService],
    }).compile();

    service = module.get<UploadsService>(UploadsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleFileUpload', () => {
    it('should handle file upload successfully', async () => {
      const mockFileName = 'uuid-test-test-image.jpg';
      const mockFilePath = '/uploads/uuid-test-test-image.jpg';

      // Mock the uploadPath property directly
      Object.defineProperty(service, 'uploadPath', {
        value: '/uploads',
        writable: true,
      });

      // Mock path.join to return the file path
      mockPath.join.mockReturnValue(mockFilePath);

      // Mock fs.existsSync to return false (directory doesn't exist)
      mockFs.existsSync.mockReturnValue(false);

      // Mock fs.mkdirSync to not throw
      mockFs.mkdirSync.mockImplementation(() => {});

      // Mock the moveFile method by spying on it
      const moveFileSpy = jest
        .spyOn(service as any, 'moveFile')
        .mockResolvedValue(undefined);

      const result = await service.handleFileUpload(mockFile as any);

      expect(mockFs.existsSync).toHaveBeenCalledWith('/uploads');
      expect(mockFs.mkdirSync).toHaveBeenCalledWith('/uploads', {
        recursive: true,
      });
      expect(moveFileSpy).toHaveBeenCalledWith(mockFile.path, mockFilePath);
      expect(result).toBe(mockFileName);
    });

    it('should throw BadRequestException for unsupported file type', async () => {
      const invalidFile = {
        ...mockFile,
        mimetype: 'application/pdf',
      };

      await expect(
        service.handleFileUpload(invalidFile as any),
      ).rejects.toThrow(
        new BadRequestException(
          'File type application/pdf is not allowed. Allowed types: image/jpeg, image/png, image/gif, image/webp',
        ),
      );
    });

    it('should throw BadRequestException for file too large', async () => {
      const largeFile = {
        ...mockFile,
        size: 10 * 1024 * 1024, // 10MB
      };

      await expect(service.handleFileUpload(largeFile as any)).rejects.toThrow(
        new BadRequestException(
          'File size 10485760 bytes exceeds maximum allowed size of 5242880 bytes',
        ),
      );
    });

    it('should throw BadRequestException when no file provided', async () => {
      await expect(service.handleFileUpload(null as any)).rejects.toThrow(
        new BadRequestException('No file provided'),
      );
    });

    it('should handle file move error gracefully', async () => {
      const mockFileName = 'uuid-test-image.jpg';
      const mockUploadPath = '/uploads';
      const mockFilePath = path.join(mockUploadPath, mockFileName);

      mockPath.join.mockReturnValue(mockFilePath);
      mockFs.existsSync.mockReturnValue(false);
      mockFs.mkdirSync.mockImplementation(() => {});

      // Mock moveFile to throw an error
      const moveFileSpy = jest
        .spyOn(service as any, 'moveFile')
        .mockRejectedValue(new Error('Move failed'));

      // Mock fs.unlink to not throw
      mockFs.unlink.mockImplementation((path, callback) => callback(null));

      await expect(service.handleFileUpload(mockFile as any)).rejects.toThrow(
        new BadRequestException('Failed to upload file: Move failed'),
      );

      expect(moveFileSpy).toHaveBeenCalled();
    });
  });

  describe('getFilePath', () => {
    it('should return correct file path', () => {
      const fileName = 'test-file.jpg';
      const expectedPath = '/uploads/test-file.jpg';

      // Reset the mock to return the specific path for this test
      mockPath.join.mockReturnValue(expectedPath);

      const result = service.getFilePath(fileName);

      expect(mockPath.join).toHaveBeenCalledWith('/uploads', fileName);
      expect(result).toBe(expectedPath);
    });
  });

  describe('deleteFile', () => {
    it('should delete file successfully when file exists', () => {
      const fileName = 'test-file.jpg';
      const filePath = '/uploads/test-file.jpg';

      mockPath.join.mockReturnValue(filePath);
      mockFs.existsSync.mockReturnValue(true);
      mockFs.unlinkSync.mockImplementation(() => {});

      const result = service.deleteFile(fileName);

      expect(mockFs.existsSync).toHaveBeenCalledWith(filePath);
      expect(mockFs.unlinkSync).toHaveBeenCalledWith(filePath);
      expect(result).toBe(true);
    });

    it('should return false when file does not exist', () => {
      const fileName = 'nonexistent-file.jpg';
      const filePath = '/uploads/nonexistent-file.jpg';

      mockPath.join.mockReturnValue(filePath);
      mockFs.existsSync.mockReturnValue(false);

      const result = service.deleteFile(fileName);

      expect(mockFs.existsSync).toHaveBeenCalledWith(filePath);
      expect(mockFs.unlinkSync).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('getFileUrl', () => {
    it('should return correct file URL', () => {
      const fileName = 'test-file.jpg';
      const expectedUrl = '/uploads/test-file.jpg';

      const result = service.getFileUrl(fileName);

      expect(result).toBe(expectedUrl);
    });
  });

  describe('moveFile', () => {
    it('should move file successfully', async () => {
      const source = '/tmp/source.jpg';
      const destination = '/uploads/destination.jpg';

      const mockReadStream = {
        pipe: jest.fn().mockReturnThis(),
        on: jest.fn().mockReturnThis(),
      };

      const mockWriteStream = {
        on: jest.fn().mockReturnThis(),
      };

      mockFs.createReadStream.mockReturnValue(mockReadStream as any);
      mockFs.createWriteStream.mockReturnValue(mockWriteStream as any);
      mockFs.existsSync.mockReturnValue(true);
      mockFs.unlink.mockImplementation((path, callback) => callback(null));

      // Simulate successful file move
      mockWriteStream.on.mockImplementation((event, callback) => {
        if (event === 'finish') {
          callback();
        }
        return mockWriteStream;
      });

      await (service as any).moveFile(source, destination);

      expect(mockFs.createReadStream).toHaveBeenCalledWith(source);
      expect(mockFs.createWriteStream).toHaveBeenCalledWith(destination);
      expect(mockReadStream.pipe).toHaveBeenCalledWith(mockWriteStream);
    });

    it('should handle read stream error', async () => {
      const source = '/tmp/source.jpg';
      const destination = '/uploads/destination.jpg';

      const mockReadStream = {
        pipe: jest.fn().mockReturnThis(),
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'error') {
            callback(new Error('Read error'));
          }
          return mockReadStream;
        }),
      };

      const mockWriteStream = {
        on: jest.fn().mockReturnThis(),
      };

      mockFs.createReadStream.mockReturnValue(mockReadStream as any);
      mockFs.createWriteStream.mockReturnValue(mockWriteStream as any);

      await expect(
        (service as any).moveFile(source, destination),
      ).rejects.toThrow('Read error');
    });

    it('should handle write stream error', async () => {
      const source = '/tmp/source.jpg';
      const destination = '/uploads/destination.jpg';

      const mockReadStream = {
        pipe: jest.fn().mockReturnThis(),
        on: jest.fn().mockReturnThis(),
      };

      const mockWriteStream = {
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'error') {
            callback(new Error('Write error'));
          }
          return mockWriteStream;
        }),
      };

      mockFs.createReadStream.mockReturnValue(mockReadStream as any);
      mockFs.createWriteStream.mockReturnValue(mockWriteStream as any);

      await expect(
        (service as any).moveFile(source, destination),
      ).rejects.toThrow('Write error');
    });
  });
});
