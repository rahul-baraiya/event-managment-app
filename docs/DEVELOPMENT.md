# 🔧 Development Guide

This guide covers everything you need to know for developing and contributing to the Event Management API.

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16.x or higher
- **npm** or **yarn**
- **MySQL** 8.0 or higher
- **Git**
- **VS Code** (recommended) with extensions:
  - TypeScript
  - ESLint
  - Prettier
  - Thunder Client (for API testing)

### Initial Setup

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd event-management-app
```

2. **Install dependencies:**
```bash
# Using npm
npm install

# Or using yarn (recommended)
yarn install
```

3. **Environment setup:**
```bash
cp env.example .env
```

4. **Configure your `.env` file:**
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=event_management_dev
JWT_SECRET=your-development-jwt-secret
JWT_REFRESH_SECRET=your-development-refresh-secret
NODE_ENV=development
```

5. **Database setup:**
```bash
# Create database
mysql -u root -p
CREATE DATABASE event_management_dev;

# Run migrations
npm run db:migrate
```

6. **Start development server:**
```bash
npm run start:dev
```

Visit http://localhost:3000/api for Swagger documentation.

## 📁 Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── auth.controller.ts   # Auth endpoints
│   ├── auth.service.ts      # Auth business logic
│   ├── auth.module.ts       # Auth module definition
│   ├── jwt.strategy.ts      # JWT strategy
│   ├── refresh-token.strategy.ts
│   └── dto/                 # Data Transfer Objects
├── common/                  # Shared modules
│   ├── config/              # Configuration files
│   ├── decorators/          # Custom decorators
│   ├── filters/             # Exception filters
│   ├── guards/              # Route guards
│   ├── interceptors/        # Request/response interceptors
│   ├── middleware/          # Custom middleware
│   └── services/            # Shared services
├── events/                  # Events module
│   ├── events.controller.ts # Event endpoints
│   ├── events.service.ts    # Event business logic
│   ├── events.model.ts      # Event database model
│   ├── events.module.ts     # Event module definition
│   └── dto/                 # Data Transfer Objects
├── users/                   # Users module
│   ├── users.controller.ts  # User endpoints
│   ├── users.service.ts     # User business logic
│   ├── users.model.ts       # User database model
│   ├── users.module.ts      # User module definition
│   └── dto/                 # Data Transfer Objects
├── uploads/                 # File upload module
├── health/                  # Health check module
├── app.module.ts           # Root application module
└── main.ts                 # Application entry point

test/                       # E2E tests
migrations/                 # Database migrations
config/                     # Database configuration
docs/                       # Documentation
```

## 🛠️ Development Workflow

### Code Style

The project uses ESLint and Prettier for code formatting:

```bash
# Lint code
npm run lint

# Format code
npm run format
```

### Git Workflow

1. **Create feature branch:**
```bash
git checkout -b feature/your-feature-name
```

2. **Make changes and commit:**
```bash
git add .
git commit -m "feat: add new feature"
```

3. **Push and create PR:**
```bash
git push origin feature/your-feature-name
```

### Commit Convention

Use conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Build/config changes

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

### E2E Tests

```bash
# Run E2E tests
npm run test:e2e

# Run all tests (unit + E2E)
npm run test:all
```

### Writing Tests

#### Unit Test Example

```typescript
// events.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';

describe('EventsService', () => {
  let service: EventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventsService],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an event', async () => {
      const createEventDto = {
        title: 'Test Event',
        description: 'Test Description',
        // ... other fields
      };

      const result = await service.create(createEventDto, 1);
      expect(result).toBeDefined();
      expect(result.title).toBe('Test Event');
    });
  });
});
```

#### E2E Test Example

```typescript
// app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('EventsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/events (GET)', () => {
    return request(app.getHttpServer())
      .get('/events')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('total');
      });
  });
});
```

## 🗄️ Database Development

### Working with Migrations

#### Create Migration

```bash
npx sequelize-cli migration:generate --name create-new-table
```

#### Migration Example

```javascript
// migrations/20250719000000-create-events-table.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Events');
  }
};
```

#### Run Migrations

```bash
# Apply migrations
npm run db:migrate

# Rollback last migration
npm run db:migrate:undo

# Reset database
npm run db:reset
```

### Working with Models

#### Model Example

```typescript
// events.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from '../users/users.model';

@Table({
  tableName: 'Events',
})
export class Event extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  startDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  endDate: Date;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
```

## 🎯 Creating New Features

### 1. Create Module Structure

```bash
# Create new module directory
mkdir src/new-feature

# Create files
touch src/new-feature/new-feature.controller.ts
touch src/new-feature/new-feature.service.ts
touch src/new-feature/new-feature.model.ts
touch src/new-feature/new-feature.module.ts
mkdir src/new-feature/dto
```

### 2. Define Data Transfer Objects

```typescript
// dto/create-new-feature.dto.ts
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNewFeatureDto {
  @ApiProperty({ description: 'Feature name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Feature description', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
```

### 3. Create Database Model

```typescript
// new-feature.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'NewFeatures',
})
export class NewFeature extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
```

### 4. Create Service

```typescript
// new-feature.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { NewFeature } from './new-feature.model';
import { CreateNewFeatureDto } from './dto/create-new-feature.dto';

@Injectable()
export class NewFeatureService {
  constructor(
    @InjectModel(NewFeature)
    private newFeatureModel: typeof NewFeature,
  ) {}

  async create(createDto: CreateNewFeatureDto): Promise<NewFeature> {
    return this.newFeatureModel.create(createDto);
  }

  async findAll(): Promise<NewFeature[]> {
    return this.newFeatureModel.findAll();
  }

  async findOne(id: number): Promise<NewFeature> {
    const feature = await this.newFeatureModel.findByPk(id);
    if (!feature) {
      throw new NotFoundException(`Feature with ID ${id} not found`);
    }
    return feature;
  }
}
```

### 5. Create Controller

```typescript
// new-feature.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NewFeatureService } from './new-feature.service';
import { CreateNewFeatureDto } from './dto/create-new-feature.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('new-features')
@Controller('new-features')
export class NewFeatureController {
  constructor(private readonly newFeatureService: NewFeatureService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createDto: CreateNewFeatureDto) {
    return this.newFeatureService.create(createDto);
  }

  @Get()
  findAll() {
    return this.newFeatureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newFeatureService.findOne(+id);
  }
}
```

### 6. Create Module

```typescript
// new-feature.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { NewFeatureController } from './new-feature.controller';
import { NewFeatureService } from './new-feature.service';
import { NewFeature } from './new-feature.model';

@Module({
  imports: [SequelizeModule.forFeature([NewFeature])],
  controllers: [NewFeatureController],
  providers: [NewFeatureService],
  exports: [NewFeatureService],
})
export class NewFeatureModule {}
```

### 7. Add to App Module

```typescript
// app.module.ts
import { NewFeatureModule } from './new-feature/new-feature.module';

@Module({
  imports: [
    // ... other imports
    NewFeatureModule,
  ],
})
export class AppModule {}
```

## 🔧 Debugging

### VS Code Debug Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug NestJS",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/main.ts",
      "runtimeArgs": ["-r", "ts-node/register"],
      "sourceMaps": true,
      "envFile": "${workspaceFolder}/.env",
      "restart": true,
      "console": "integratedTerminal"
    }
  ]
}
```

### Debug Mode

```bash
# Start in debug mode
npm run start:debug
```

## 📦 Package Management

### Adding Dependencies

```bash
# Production dependency
npm install package-name

# Development dependency
npm install -D package-name

# Update package.json with exact versions
npm install --save-exact package-name
```

### Checking for Updates

```bash
# Check outdated packages
npm outdated

# Update packages
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## 🔒 Security Best Practices

1. **Always validate input** using class-validator
2. **Use parameterized queries** (Sequelize handles this)
3. **Sanitize user input** using the sanitization middleware
4. **Implement proper authentication** for protected routes
5. **Use HTTPS** in production
6. **Keep dependencies updated**
7. **Follow principle of least privilege**
8. **Log security events**

## 🚨 Common Issues & Solutions

### Issue: Module not found errors
**Solution:** Check import paths and ensure modules are properly exported

### Issue: Database connection fails
**Solution:** Verify database credentials and ensure MySQL is running

### Issue: JWT token errors
**Solution:** Check JWT secret configuration and token expiration

### Issue: File upload fails
**Solution:** Verify file size limits and allowed file types

### Issue: Tests failing
**Solution:** Ensure test database is set up and migrations are run

## 📚 Useful Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
- [Swagger/OpenAPI](https://swagger.io/docs/)
