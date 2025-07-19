import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(authCredentialsDto: AuthCredentialsDto) {
    const user = await this.usersService.createUser(authCredentialsDto);
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersService.validateUserPassword({
      username: loginUserDto.username,
      email: loginUserDto.username, // Allow login with email too
      password: loginUserDto.password,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }

  async deleteUser(id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.usersService.remove(id);
    return { message: 'User deleted successfully' };
  }

  async updateUser(id: number, updateUserDto: CreateUserDto) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.usersService.update(id, updateUserDto);
  }
}
