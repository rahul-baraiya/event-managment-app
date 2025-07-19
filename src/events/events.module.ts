import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event } from './events.model';
import { User } from '../users/users.model';
import { UploadsService } from '../uploads/uploads.service';

@Module({
  imports: [SequelizeModule.forFeature([Event, User])],
  controllers: [EventsController],
  providers: [EventsService, UploadsService],
  exports: [EventsService],
})
export class EventsModule {}
