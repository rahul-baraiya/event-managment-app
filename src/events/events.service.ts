import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Event } from './events.model';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FilterEventDto } from './dto/filter-event.dto';
import { User } from '../users/users.model';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event)
    private readonly eventModel: typeof Event,
  ) {}

  async create(createEventDto: CreateEventDto, userId: number): Promise<Event> {
    const eventData = {
      ...createEventDto,
      userId,
      startDate: new Date(createEventDto.startDate),
      endDate: new Date(createEventDto.endDate),
    };
    const event = await this.eventModel.create(eventData as any);
    return event;
  }

  async findAll(
    filterEventDto: FilterEventDto,
  ): Promise<{ events: Event[]; total: number; page: number; limit: number }> {
    const {
      startDate,
      endDate,
      category,
      search,
      page = 1,
      limit = 10,
      sortBy = 'startDate',
      sortOrder = 'ASC',
    } = filterEventDto;

    const query: any = {};
    const offset = (page - 1) * limit;

    // Search functionality
    if (search) {
      query[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { category: { [Op.like]: `%${search}%` } },
      ];
    }

    // Date filters
    if (startDate) {
      query.startDate = { [Op.gte]: new Date(startDate) };
    }
    if (endDate) {
      query.endDate = { [Op.lte]: new Date(endDate) };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Sorting - fix the order parameter
    const order = [[sortBy, sortOrder.toUpperCase()]] as any;

    const { count, rows } = await this.eventModel.findAndCountAll({
      where: query,
      order,
      limit,
      offset,
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email'],
        },
      ],
    });

    return {
      events: rows,
      total: count,
      page: parseInt(page.toString()),
      limit: parseInt(limit.toString()),
    };
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventModel.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'email'],
        },
      ],
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async update(
    id: number,
    updateEventDto: UpdateEventDto,
    userId: number,
  ): Promise<Event> {
    const event = await this.findOne(id);
    if (event.userId !== userId) {
      throw new NotFoundException(
        `You are not authorized to update this event`,
      );
    }

    const updateData: any = { ...updateEventDto };
    if (updateEventDto.startDate) {
      updateData.startDate = new Date(updateEventDto.startDate);
    }
    if (updateEventDto.endDate) {
      updateData.endDate = new Date(updateEventDto.endDate);
    }

    await event.update(updateData);
    return event;
  }

  async remove(id: number, userId: number): Promise<void> {
    const event = await this.findOne(id);
    if (event.userId !== userId) {
      throw new NotFoundException(
        `You are not authorized to delete this event`,
      );
    }
    await event.destroy();
  }
}
