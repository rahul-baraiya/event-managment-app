import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';
import { EventsService } from './events.service';
import { Event } from './events.model';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FilterEventDto } from './dto/filter-event.dto';

describe('EventsService', () => {
  let service: EventsService;
  let eventModel: any;

  const mockEventModel = {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAndCountAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };

  const mockEvent = {
    id: 1,
    title: 'Test Event',
    description: 'Test Description',
    startDate: new Date('2024-07-15'),
    endDate: new Date('2024-07-16'),
    totalGuests: 100,
    category: 'Test',
    userId: 1,
    images: ['image1.jpg'],
    update: jest.fn(),
    destroy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getModelToken(Event),
          useValue: mockEventModel,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    eventModel = module.get(getModelToken(Event));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an event successfully', async () => {
      const createEventDto: CreateEventDto = {
        title: 'Test Event',
        description: 'Test Description',
        startDate: '2024-07-15T00:00:00Z',
        endDate: '2024-07-16T00:00:00Z',
        totalGuests: 100,
        category: 'Test',
        images: ['image1.jpg'],
      };

      const userId = 1;
      mockEventModel.create.mockResolvedValue(mockEvent);

      const result = await service.create(createEventDto, userId);

      expect(mockEventModel.create).toHaveBeenCalledWith({
        ...createEventDto,
        userId,
        startDate: expect.any(Date),
        endDate: expect.any(Date),
      });
      expect(result).toEqual(mockEvent);
    });
  });

  describe('findAll', () => {
    it('should return paginated events with default parameters', async () => {
      const filterDto: FilterEventDto = {};
      const mockResult = {
        count: 1,
        rows: [mockEvent],
      };

      mockEventModel.findAndCountAll.mockResolvedValue(mockResult);

      const result = await service.findAll(filterDto);

      expect(mockEventModel.findAndCountAll).toHaveBeenCalledWith({
        where: {},
        order: [['startDate', 'ASC']],
        limit: 10,
        offset: 0,
        include: expect.any(Array),
      });
      expect(result).toEqual({
        events: [mockEvent],
        total: 1,
        page: 1,
        limit: 10,
      });
    });

    it('should apply search filter', async () => {
      const filterDto: FilterEventDto = { search: 'test' };
      const mockResult = { count: 1, rows: [mockEvent] };

      mockEventModel.findAndCountAll.mockResolvedValue(mockResult);

      await service.findAll(filterDto);

      expect(mockEventModel.findAndCountAll).toHaveBeenCalledWith({
        where: {
          [Op.or]: [
            { title: { [Op.like]: '%test%' } },
            { description: { [Op.like]: '%test%' } },
            { category: { [Op.like]: '%test%' } },
          ],
        },
        order: [['startDate', 'ASC']],
        limit: 10,
        offset: 0,
        include: expect.any(Array),
      });
    });

    it('should apply custom pagination and sorting', async () => {
      const filterDto: FilterEventDto = {
        page: 2,
        limit: 5,
        sortBy: 'title',
        sortOrder: 'DESC',
      };
      const mockResult = { count: 1, rows: [mockEvent] };

      mockEventModel.findAndCountAll.mockResolvedValue(mockResult);

      await service.findAll(filterDto);

      expect(mockEventModel.findAndCountAll).toHaveBeenCalledWith({
        where: {},
        order: [['title', 'DESC']],
        limit: 5,
        offset: 5,
        include: expect.any(Array),
      });
    });
  });

  describe('findOne', () => {
    it('should return an event by id', async () => {
      const eventId = 1;
      mockEventModel.findByPk.mockResolvedValue(mockEvent);

      const result = await service.findOne(eventId);

      expect(mockEventModel.findByPk).toHaveBeenCalledWith(eventId, {
        include: expect.any(Array),
      });
      expect(result).toEqual(mockEvent);
    });

    it('should throw NotFoundException when event not found', async () => {
      const eventId = 999;
      mockEventModel.findByPk.mockResolvedValue(null);

      await expect(service.findOne(eventId)).rejects.toThrow(
        new NotFoundException(`Event with ID ${eventId} not found`),
      );
    });
  });

  describe('update', () => {
    it('should update an event successfully', async () => {
      const eventId = 1;
      const userId = 1;
      const updateDto: UpdateEventDto = {
        title: 'Updated Event',
        description: 'Updated Description',
      };

      mockEventModel.findByPk.mockResolvedValue(mockEvent);
      mockEvent.update.mockResolvedValue(mockEvent);

      const result = await service.update(eventId, updateDto, userId);

      expect(mockEvent.update).toHaveBeenCalledWith(updateDto);
      expect(result).toEqual(mockEvent);
    });

    it('should throw NotFoundException when user is not authorized', async () => {
      const eventId = 1;
      const userId = 2; // Different user
      const updateDto: UpdateEventDto = { title: 'Updated Event' };

      mockEventModel.findByPk.mockResolvedValue(mockEvent);

      await expect(service.update(eventId, updateDto, userId)).rejects.toThrow(
        new NotFoundException('You are not authorized to update this event'),
      );
    });

    it('should handle date conversion in update', async () => {
      const eventId = 1;
      const userId = 1;
      const updateDto: UpdateEventDto = {
        startDate: '2024-08-15T00:00:00Z',
        endDate: '2024-08-16T00:00:00Z',
      };

      mockEventModel.findByPk.mockResolvedValue(mockEvent);
      mockEvent.update.mockResolvedValue(mockEvent);

      await service.update(eventId, updateDto, userId);

      expect(mockEvent.update).toHaveBeenCalledWith({
        startDate: expect.any(Date),
        endDate: expect.any(Date),
      });
    });
  });

  describe('remove', () => {
    it('should delete an event successfully', async () => {
      const eventId = 1;
      const userId = 1;

      mockEventModel.findByPk.mockResolvedValue(mockEvent);
      mockEvent.destroy.mockResolvedValue(undefined);

      await service.remove(eventId, userId);

      expect(mockEvent.destroy).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user is not authorized', async () => {
      const eventId = 1;
      const userId = 2; // Different user

      mockEventModel.findByPk.mockResolvedValue(mockEvent);

      await expect(service.remove(eventId, userId)).rejects.toThrow(
        new NotFoundException('You are not authorized to delete this event'),
      );
    });
  });
});
