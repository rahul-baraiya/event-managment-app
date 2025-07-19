import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UploadsModule } from './uploads/uploads.module';
import { CommonModule } from './common/common.module';
import { HealthModule } from './health/health.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { SanitizeMiddleware } from './common/middleware/sanitize.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'event_management',
      autoLoadModels: true,
      synchronize: true,
    }),
    CommonModule,
    EventsModule,
    UsersModule,
    AuthModule,
    UploadsModule,
    HealthModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SanitizeMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
