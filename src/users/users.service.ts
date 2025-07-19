import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { User } from './users.model';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { username, email, password } = authCredentialsDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await this.userModel.create({
      username,
      email,
      password: hashedPassword,
    } as any);

    // Remove password from response
    const { password: userPassword, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword as User;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.findAll({
      attributes: { exclude: ['password'] },
    });
    return users;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id, {
      attributes: { exclude: ['password'] },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findById(id: number): Promise<User | null> {
    return this.userModel.findByPk(id);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<User | null> {
    const { username, password } = authCredentialsDto;

    const user = await this.userModel.findOne({
      where: {
        [Op.or]: [{ username }, { email: username }],
      },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      const saltRounds = 10;
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        saltRounds,
      );
    }

    await user.update(updateUserDto);

    const { password: userPassword, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword as User;
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }
}
