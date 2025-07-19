import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { Op } from 'sequelize';
import { UsersService } from './users.service';
import { User } from './users.model';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: any;

  const mockUserModel = {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };

  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword',
    toJSON: jest.fn().mockReturnValue({
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedPassword',
    }),
    update: jest.fn(),
    destroy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get(getModelToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue(mockUser);

      const result = await service.createUser(authCredentialsDto);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        where: {
          [Op.or]: [{ username: 'testuser' }, { email: 'test@example.com' }],
        },
      });
      expect(mockUserModel.create).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: expect.any(String), // hashed password
      });
      expect(result).toEqual({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      });
    });

    it('should throw ConflictException when user already exists', async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password123',
      };

      mockUserModel.findOne.mockResolvedValue(mockUser);

      await expect(service.createUser(authCredentialsDto)).rejects.toThrow(
        new ConflictException('Username or email already exists'),
      );
    });
  });

  describe('findAll', () => {
    it('should return all users without passwords', async () => {
      const mockUsers = [
        {
          ...mockUser,
          toJSON: () => ({ id: 1, username: 'user1', email: 'user1@test.com' }),
        },
        {
          ...mockUser,
          toJSON: () => ({ id: 2, username: 'user2', email: 'user2@test.com' }),
        },
      ];

      mockUserModel.findAll.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(mockUserModel.findAll).toHaveBeenCalledWith({
        attributes: { exclude: ['password'] },
      });
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should return a user by id without password', async () => {
      const userId = 1;
      const userWithoutPassword = {
        ...mockUser,
        toJSON: () => ({
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
        }),
      };

      mockUserModel.findByPk.mockResolvedValue(userWithoutPassword);

      const result = await service.findOne(userId);

      expect(mockUserModel.findByPk).toHaveBeenCalledWith(userId, {
        attributes: { exclude: ['password'] },
      });
      expect(result).toEqual(userWithoutPassword);
    });

    it('should throw NotFoundException when user not found', async () => {
      const userId = 999;
      mockUserModel.findByPk.mockResolvedValue(null);

      await expect(service.findOne(userId)).rejects.toThrow(
        new NotFoundException(`User with ID ${userId} not found`),
      );
    });
  });

  describe('findById', () => {
    it('should return a user by id with password', async () => {
      const userId = 1;
      mockUserModel.findByPk.mockResolvedValue(mockUser);

      const result = await service.findById(userId);

      expect(mockUserModel.findByPk).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      const userId = 999;
      mockUserModel.findByPk.mockResolvedValue(null);

      const result = await service.findById(userId);

      expect(result).toBeNull();
    });
  });

  describe('findByUsername', () => {
    it('should return a user by username', async () => {
      const username = 'testuser';
      mockUserModel.findOne.mockResolvedValue(mockUser);

      const result = await service.findByUsername(username);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        where: { username },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'test@example.com';
      mockUserModel.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail(email);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(result).toEqual(mockUser);
    });
  });

  describe('validateUserPassword', () => {
    it('should return user when credentials are valid', async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const bcrypt = require('bcrypt');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      mockUserModel.findOne.mockResolvedValue(mockUser);

      const result = await service.validateUserPassword(authCredentialsDto);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        where: {
          [Op.or]: [{ username: 'testuser' }, { email: 'testuser' }],
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        username: 'nonexistent',
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      mockUserModel.findOne.mockResolvedValue(null);

      const result = await service.validateUserPassword(authCredentialsDto);

      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const bcrypt = require('bcrypt');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      mockUserModel.findOne.mockResolvedValue(mockUser);

      const result = await service.validateUserPassword(authCredentialsDto);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = {
        username: 'updateduser',
        email: 'updated@example.com',
      };

      const updatedUser = {
        ...mockUser,
        ...updateUserDto,
        toJSON: jest.fn().mockReturnValue({
          id: 1,
          username: 'updateduser',
          email: 'updated@example.com',
        }),
      };
      mockUserModel.findByPk.mockResolvedValue(updatedUser);
      updatedUser.update.mockResolvedValue(updatedUser);

      const result = await service.update(userId, updateUserDto);

      expect(updatedUser.update).toHaveBeenCalledWith(updateUserDto);
      expect(result).toEqual({
        id: 1,
        username: 'updateduser',
        email: 'updated@example.com',
      });
    });

    it('should hash password when updating password', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = {
        password: 'newpassword',
      };

      const updatedUser = { ...mockUser, ...updateUserDto };
      mockUserModel.findByPk.mockResolvedValue(updatedUser);
      updatedUser.update.mockResolvedValue(updatedUser);

      await service.update(userId, updateUserDto);

      expect(updatedUser.update).toHaveBeenCalledWith({
        password: expect.any(String), // hashed password
      });
    });
  });

  describe('remove', () => {
    it('should delete a user successfully', async () => {
      const userId = 1;
      mockUserModel.findByPk.mockResolvedValue(mockUser);
      mockUser.destroy.mockResolvedValue(undefined);

      await service.remove(userId);

      expect(mockUser.destroy).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user not found', async () => {
      const userId = 999;
      mockUserModel.findByPk.mockResolvedValue(null);

      await expect(service.remove(userId)).rejects.toThrow(
        new NotFoundException(`User with ID ${userId} not found`),
      );
    });
  });
});
