import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event } from './events.model';
import { User } from '../users/users.model';
import { UploadsService } from '../uploads/uploads.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Event, User]),
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(__dirname, '..', '..', 'temp-uploads');
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `temp-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 10,
      },
    }),
  ],
  controllers: [EventsController],
  providers: [EventsService, UploadsService],
  exports: [EventsService],
})
export class EventsModule {}
