import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    createUser: jest.fn(),
    validateUserPassword: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    update: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const mockJwtPayload = {
        sub: 1,
        username: 'testuser',
        email: 'test@example.com',
      };
      const mockToken = 'jwt-token';

      mockUsersService.createUser.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.register(authCredentialsDto);

      expect(mockUsersService.createUser).toHaveBeenCalledWith(
        authCredentialsDto,
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith(mockJwtPayload);
      expect(result).toEqual({
        accessToken: mockToken,
        user: {
          id: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
        },
      });
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      const loginUserDto: LoginUserDto = {
        username: 'testuser',
        password: 'password123',
      };

      const mockJwtPayload = {
        sub: 1,
        username: 'testuser',
        email: 'test@example.com',
      };
      const mockToken = 'jwt-token';

      mockUsersService.validateUserPassword.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(loginUserDto);

      expect(mockUsersService.validateUserPassword).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'testuser', // Allow login with email too
        password: 'password123',
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith(mockJwtPayload);
      expect(result).toEqual({
        accessToken: mockToken,
        user: {
          id: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
        },
      });
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      const loginUserDto: LoginUserDto = {
        username: 'testuser',
        password: 'wrongpassword',
      };

      mockUsersService.validateUserPassword.mockResolvedValue(null);

      await expect(service.login(loginUserDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      const userId = 1;

      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockUsersService.remove.mockResolvedValue(undefined);

      const result = await service.deleteUser(userId);

      expect(mockUsersService.findOne).toHaveBeenCalledWith(userId);
      expect(mockUsersService.remove).toHaveBeenCalledWith(userId);
      expect(result).toEqual({ message: 'User deleted successfully' });
    });

    it('should throw NotFoundException when user not found', async () => {
      const userId = 999;

      mockUsersService.findOne.mockResolvedValue(null);

      await expect(service.deleteUser(userId)).rejects.toThrow(
        new NotFoundException(`User with ID ${userId} not found`),
      );
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const userId = 1;
      const updateUserDto: CreateUserDto = {
        username: 'updateduser',
        email: 'updated@example.com',
        password: 'newpassword',
      };

      const updatedUser = { ...mockUser, ...updateUserDto };

      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await service.updateUser(userId, updateUserDto);

      expect(mockUsersService.findOne).toHaveBeenCalledWith(userId);
      expect(mockUsersService.update).toHaveBeenCalledWith(
        userId,
        updateUserDto,
      );
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      const userId = 999;
      const updateUserDto: CreateUserDto = {
        username: 'updateduser',
        email: 'updated@example.com',
        password: 'newpassword',
      };

      mockUsersService.findOne.mockResolvedValue(null);

      await expect(service.updateUser(userId, updateUserDto)).rejects.toThrow(
        new NotFoundException(`User with ID ${userId} not found`),
      );
    });
  });
});
