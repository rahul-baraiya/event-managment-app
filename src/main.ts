import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { LoggerService } from './common/services/logger.service';
import { corsOptions } from './common/config/cors.config';
import { helmetOptions } from './common/config/helmet.config';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Security headers with Helmet
  app.use(helmet(helmetOptions));

  // CORS configuration
  app.enableCors(corsOptions);

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);

  // Serve static files from uploads directory with security headers
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
    setHeaders: (res) => {
      res.set('X-Content-Type-Options', 'nosniff');
      res.set('X-Frame-Options', 'DENY');
    },
  });

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global logging interceptor
  const loggerService = app.get(LoggerService);
  app.useGlobalInterceptors(new LoggingInterceptor(loggerService));

  // Global validation pipe with enhanced security
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      forbidUnknownValues: true,
      skipMissingProperties: false,
      skipNullProperties: false,
      skipUndefinedProperties: false,
    }),
  );

  // Swagger documentation setup with enhanced security
  const config = new DocumentBuilder()
    .setTitle('Event Management API')
    .setDescription(
      `A comprehensive API for managing events with CRUD operations, authentication, and file uploads.
      
## Features
- 🔐 JWT Authentication with refresh tokens
- 🎯 Full CRUD operations for events
- 📁 File upload support for event images
- 🔍 Advanced filtering and pagination
- 🛡️ Security features (Rate limiting, CORS, etc.)
- 👥 User management and authorization

## Authentication
Most endpoints require authentication. Use the 'Authorize' button below to set your Bearer token.

## Base URL
\`http://localhost:3000\`

## Rate Limiting
- 100 requests per 15 minutes per IP address
- Applies to all endpoints

## File Uploads
- Supported formats: JPEG, PNG, GIF, WebP
- Maximum file size: 5MB per file
- Maximum 10 files per request
      `,
    )
    .setVersion('1.0.0')
    .setContact(
      'Rahul Baraiya',
      'https://github.com/your-username/event-management-app',
      'your-email@example.com'
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3000', 'Development server')
    .addServer('https://your-api-domain.com', 'Production server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addApiKey(
      { 
        type: 'apiKey', 
        name: 'X-API-Key', 
        in: 'header',
        description: 'API Key for additional authentication (if required)'
      }, 
      'api-key'
    )
    .addTag('auth', 'Authentication operations - Register, login, profile management')
    .addTag('events', 'Event management operations - CRUD operations with filtering')
    .addTag('users', 'User management operations - User profiles and administration')
    .addTag('uploads', 'File upload operations - Image uploads for events')
    .addTag('health', 'Health check operations - System monitoring and status')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tryItOutEnabled: true,
      filter: true,
      displayRequestDuration: true,
      docExpansion: 'list',
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
    },
    customSiteTitle: 'Event Management API Documentation',
    customfavIcon: '/favicon.ico',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    ],
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Event Management API is running!`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Server: http://localhost:${port}`);
  console.log(`📚 API Docs: http://localhost:${port}/api`);
  console.log(`📁 Uploads: http://localhost:${port}/uploads/`);
  console.log(`❤️  Health: http://localhost:${port}/health`);
}

bootstrap().catch((err) => {
  console.error('Error starting application:', err);
  process.exit(1);
});
