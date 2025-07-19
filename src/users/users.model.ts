import { Column, Model, Table, HasMany, DataType } from 'sequelize-typescript';
import { Event } from '../events/events.model';

@Table
export class User extends Model<User> {
  @Column({
    allowNull: false,
    unique: true,
    type: DataType.STRING(255),
  })
  username: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(255),
  })
  password: string;

  @Column({
    allowNull: false,
    unique: true,
    type: DataType.STRING(255),
  })
  email: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(100),
  })
  firstName?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(100),
  })
  lastName?: string;

  @Column({
    allowNull: true,
    type: DataType.ENUM('user', 'admin', 'moderator'),
    defaultValue: 'user',
  })
  role?: string;

  @Column({
    allowNull: true,
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isActive?: boolean;

  @HasMany(() => Event)
  events: Event[];
}
