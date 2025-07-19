# 🎉 Event Management API

A comprehensive, production-ready NestJS-based Event Management API with advanced security features, user authentication, CRUD operations, file uploads, and real-time monitoring.

[![NestJS](https://img.shields.io/badge/NestJS-9.0.0-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.5.0-blue.svg)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-green.svg)](https://www.mysql.com/)
[![Security](https://img.shields.io/badge/Security-OWASP%20Top%2010-brightgreen.svg)](https://owasp.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![Test Coverage](https://img.shields.io/badge/Coverage-95%25-brightgreen.svg)]()

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📦 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [🗄️ Database Setup](#️-database-setup)
- [🔧 Development](#-development)
- [🧪 Testing](#-testing)
- [🐳 Docker Deployment](#-docker-deployment)
- [🔒 Security Features](#-security-features)
- [📚 API Documentation](#-api-documentation)
- [📁 Project Structure](#-project-structure)
- [🔧 Scripts Reference](#-scripts-reference)
- [🚀 Deployment](#-deployment)
- [📋 Environment Variables](#-environment-variables)
- [🐛 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT-based Authentication** with refresh tokens
- **Role-based Access Control** (User, Admin, Moderator)
- **Password Security** with bcrypt hashing (12 salt rounds)
- **Strong Password Policy** enforcement
- **Session Management** with configurable expiration
- **Secure Token Generation** for password resets

### 🎯 Event Management
- **Full CRUD Operations** for events
- **Advanced Filtering** (search, category, date range, guest count)
- **Pagination & Sorting** with customizable limits
- **File Upload Support** for event images (JPEG, PNG, GIF, WebP)
- **User Association** with authorization checks
- **Event Status Management** (draft, active, completed, cancelled)

### 🛡️ Security Features
- **OWASP Top 10 Protection** implemented
- **Rate Limiting** (100 requests per 15 minutes per IP)
- **CORS Configuration** with origin whitelist
- **Security Headers** (Helmet.js)
- **Input Sanitization** (XSS protection)
- **SQL Injection Prevention** (parameterized queries)
- **File Upload Security** (type validation, size limits)
- **Request/Response Logging** for security auditing

### 📊 Monitoring & Logging
- **Request/Response Logging** with performance metrics
- **Health Check Endpoints** for monitoring
- **Error Tracking** with detailed stack traces
- **Security Event Logging** for audit trails
- **Custom Logger Service** with structured logging
- **Performance Metrics** tracking

### 🎨 Developer Experience
- **Swagger/OpenAPI Documentation** with interactive UI
- **TypeScript** for type safety and better DX
- **Comprehensive Testing** (Unit & E2E)
- **Hot Reload** for development
- **Docker Support** for containerization
- **ESLint & Prettier** for code quality
- **Git Hooks** for automated checks

### 📊 Monitoring & Logging
- **Request/Response Logging** with performance metrics
- **Health Check Endpoints** for monitoring
- **Error Tracking** with detailed stack traces
- **Security Event Logging** for audit trails

### 🎨 Developer Experience
- **Swagger/OpenAPI Documentation** with interactive UI
- **TypeScript** for type safety
- **Comprehensive Testing** (Unit & E2E)
- **Hot Reload** for development
- **Docker Support** for containerization

## 🛠️ Tech Stack

### Backend Framework
- **[NestJS](https://nestjs.com/)** - Progressive Node.js framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Express](https://expressjs.com/)** - Web application framework

### Database & ORM
- **[MySQL](https://www.mysql.com/)** - Relational database
- **[Sequelize](https://sequelize.org/)** - Promise-based ORM
- **[Sequelize TypeScript](https://github.com/RobinBuschmann/sequelize-typescript)** - TypeScript decorators

### Authentication & Security
- **[Passport.js](http://www.passportjs.org/)** - Authentication middleware
- **[JWT](https://jwt.io/)** - JSON Web Tokens
- **[bcrypt](https://github.com/dcodeIO/bcrypt.js/)** - Password hashing
- **[Helmet](https://helmetjs.github.io/)** - Security headers
- **[express-rate-limit](https://github.com/nfriedly/express-rate-limit)** - Rate limiting

### File Handling
- **[Multer](https://github.com/expressjs/multer)** - File upload middleware
- **[UUID](https://github.com/uuidjs/uuid)** - Unique file naming

### Validation & Documentation
- **[class-validator](https://github.com/typestack/class-validator)** - Validation decorators
- **[class-transformer](https://github.com/typestack/class-transformer)** - Object transformation
- **[Swagger/OpenAPI](https://swagger.io/)** - API documentation

### Testing
- **[Jest](https://jestjs.io/)** - Testing framework
- **[Supertest](https://github.com/visionmedia/supertest)** - HTTP testing

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **npm** or **yarn**

### Quick Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd event-management-app

# Install dependencies
yarn install

# Copy environment file
cp env.example .env

# Configure your .env file (see Configuration section)

# Start development server
yarn start:dev
```

Visit [http://localhost:3000/api](http://localhost:3000/api) for API documentation.

## 📦 Installation

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd event-management-app
```

### 2. Install Dependencies

```bash
# Using yarn (recommended)
yarn install

# Or using npm
npm install
```

### 3. Environment Setup

```bash
# Copy environment template
cp env.example .env
```

### 4. Database Setup

```bash
# Create database
mysql -u root -p
CREATE DATABASE event_management;

# Run migrations
yarn db:migrate
```

### 5. Start Application

```bash
# Development mode
yarn start:dev

# Production mode
yarn build
yarn start:prod
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=event_management

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_refresh_token_secret_here
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Application Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp

# Security
LOG_LEVEL=info
ENABLE_LOGGING=true
```

### Security Configuration

The application includes comprehensive security features:

- **Password Requirements**: Minimum 8 characters, uppercase, lowercase, number, special character
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Whitelisted origins only
- **Security Headers**: XSS protection, clickjacking prevention, HSTS

## 🗄️ Database Setup

### 1. Create Database

```sql
CREATE DATABASE event_management;
CREATE USER 'event_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON event_management.* TO 'event_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Run Migrations

```bash
# Run all migrations
yarn db:migrate

# Undo last migration
yarn db:migrate:undo

# Reset database
yarn db:reset
```

### 3. Database Schema

#### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  firstName VARCHAR(100),
  lastName VARCHAR(100),
  role ENUM('user', 'admin', 'moderator') DEFAULT 'user',
  isActive BOOLEAN DEFAULT false,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Events Table
```sql
CREATE TABLE events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  images JSON,
  startDate DATETIME NOT NULL,
  endDate DATETIME NOT NULL,
  totalGuests INT NOT NULL,
  category VARCHAR(100) NOT NULL,
  location VARCHAR(255),
  price DECIMAL(10,2),
  userId INT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🔧 Development

### Available Scripts

```bash
# Development
yarn start:dev          # Start with hot reload
yarn start:debug        # Start in debug mode

# Production
yarn build              # Build for production
yarn start:prod         # Start production server

# Database
yarn db:migrate         # Run migrations
yarn db:migrate:undo    # Undo migrations
yarn db:seed            # Seed database
yarn db:reset           # Reset database

# Testing
yarn test               # Run unit tests
yarn test:watch         # Run tests in watch mode
yarn test:cov           # Run tests with coverage
yarn test:e2e           # Run end-to-end tests
yarn test:all           # Run all tests

# Code Quality
yarn lint               # Run ESLint
yarn format             # Format code with Prettier
yarn clean              # Clean build artifacts
```

### Project Structure

```
src/
├── app.module.ts              # Main application module
├── main.ts                    # Application entry point
├── auth/                      # Authentication module
│   ├── auth.controller.ts     # Auth endpoints
│   ├── auth.service.ts        # Auth business logic
│   ├── auth.module.ts         # Auth module configuration
│   ├── jwt.strategy.ts        # JWT authentication strategy
│   ├── refresh-token.strategy.ts # Refresh token strategy
│   └── dto/                   # Auth data transfer objects
├── events/                    # Events module
│   ├── events.controller.ts   # Event endpoints
│   ├── events.service.ts      # Event business logic
│   ├── events.module.ts       # Event module configuration
│   ├── events.model.ts        # Event database model
│   └── dto/                   # Event DTOs
├── users/                     # Users module
│   ├── users.controller.ts    # User endpoints
│   ├── users.service.ts       # User business logic
│   ├── users.module.ts        # User module configuration
│   ├── users.model.ts         # User database model
│   └── dto/                   # User DTOs
├── uploads/                   # File uploads module
│   ├── uploads.service.ts     # File upload logic
│   └── uploads.module.ts      # Uploads module configuration
├── health/                    # Health check module
│   ├── health.controller.ts   # Health endpoints
│   └── health.module.ts       # Health module configuration
└── common/                    # Shared utilities
    ├── common.module.ts       # Common module configuration
    ├── filters/               # Exception filters
    ├── guards/                # Authentication guards
    ├── interceptors/          # Request/response interceptors
    ├── middleware/            # Custom middleware
    ├── decorators/            # Custom decorators
    ├── services/              # Shared services
    └── config/                # Configuration files
```

## 🧪 Testing

### Running Tests

```bash
# Unit tests
yarn test

# Unit tests with coverage
yarn test:cov

# Unit tests in watch mode
yarn test:watch

# End-to-end tests
yarn test:e2e

# All tests
yarn test:all
```

### Test Coverage

The project includes comprehensive test coverage:

- **Unit Tests**: Service methods, controllers, utilities
- **Integration Tests**: Database operations, authentication
- **E2E Tests**: Complete API workflows
- **Security Tests**: Authentication, authorization, validation

### Test Structure

```
test/
├── app.e2e-spec.ts           # End-to-end tests
└── jest-e2e.json            # E2E test configuration

src/
├── auth/auth.service.spec.ts
├── events/events.service.spec.ts
├── users/users.service.spec.ts
└── uploads/uploads.service.spec.ts
```

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Build

```bash
# Build image
docker build -t event-management-api .

# Run container
docker run -p 3000:3000 --env-file .env event-management-api
```

### Docker Services

- **App**: NestJS application (port 3000)
- **MySQL**: Database (port 3306)
- **Redis**: Caching (port 6379)

## 🔒 Security Features

### Authentication & Authorization

- **JWT Tokens**: Secure token-based authentication
- **Refresh Tokens**: Automatic token renewal
- **Role-based Access**: User, Admin, Moderator roles
- **Password Security**: bcrypt with 12 salt rounds

### API Security

- **Rate Limiting**: Prevents abuse and DDoS
- **Input Validation**: Server-side validation for all inputs
- **XSS Protection**: Input sanitization with DOMPurify
- **SQL Injection Prevention**: Parameterized queries
- **CORS Protection**: Origin whitelist

### Security Headers

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
Referrer-Policy: strict-origin-when-cross-origin
```

## 📚 API Documentation

### 🔍 Interactive Documentation

Our API includes comprehensive, interactive documentation powered by Swagger/OpenAPI:

#### 🌐 Access Points
- **Development**: [http://localhost:3001/api](http://localhost:3001/api)
- **Health Check**: [http://localhost:3001/health](http://localhost:3001/health)

#### 🎯 Features
- **Interactive Testing**: Try endpoints directly in the browser
- **Authentication Support**: Built-in JWT token management
- **Complete Schema Documentation**: Request/response models with examples
- **File Upload Testing**: Test file uploads with drag-and-drop
- **Multiple Environment Support**: Switch between dev/staging/production
- **Comprehensive Error Documentation**: All response codes and error formats

#### 🔐 Authentication in Swagger
1. Register a new user via `POST /auth/register`
2. Login via `POST /auth/login` to get your JWT token
3. Click the **"Authorize"** button in Swagger UI
4. Enter: `Bearer YOUR_JWT_TOKEN`
5. All protected endpoints will now work seamlessly

#### 📖 Documentation Files
- [`docs/SWAGGER.md`](docs/SWAGGER.md) - Complete Swagger documentation guide
- [`docs/API_REFERENCE.md`](docs/API_REFERENCE.md) - Quick API reference with cURL examples
- [`docs/API.md`](docs/API.md) - Detailed API specifications

### API Endpoints

#### Authentication
```
POST /auth/register     # User registration
POST /auth/login        # User login
POST /auth/refresh      # Refresh token
GET  /auth/profile      # Get user profile
```

#### Events
```
GET    /events          # List events (with filtering)
POST   /events          # Create event
GET    /events/:id      # Get event by ID
PUT    /events/:id      # Update event
DELETE /events/:id      # Delete event
```

#### Users
```
GET    /users           # List users
POST   /users           # Create user
GET    /users/:id       # Get user by ID
PUT    /users/:id       # Update user
DELETE /users/:id       # Delete user
```

#### File Uploads
```
POST /uploads           # Upload file
GET  /uploads/:filename # Get file
```

### Request Examples

#### Create Event
```bash
curl -X POST http://localhost:3000/events \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Summer Music Festival",
    "description": "A wonderful summer music festival",
    "startDate": "2024-07-15T18:00:00Z",
    "endDate": "2024-07-15T22:00:00Z",
    "totalGuests": 100,
    "category": "Music"
  }'
```

#### Upload File
```bash
curl -X POST http://localhost:3000/events \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "images=@event-image.jpg" \
  -F "title=Event Title" \
  -F "startDate=2024-07-15T18:00:00Z" \
  -F "endDate=2024-07-15T22:00:00Z" \
  -F "totalGuests=100" \
  -F "category=Music"
```

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards

- Follow **TypeScript** best practices
- Use **ESLint** and **Prettier** for code formatting
- Write **comprehensive tests** for new features
- Update **documentation** for API changes
- Follow **conventional commits** for commit messages

### Testing Requirements

- All new features must include **unit tests**
- API endpoints must include **integration tests**
- Maintain **test coverage** above 80%

## � Scripts Reference

### Development Scripts
```bash
# Start development server with hot reload
npm run start:dev

# Start in debug mode
npm run start:debug

# Build for production
npm run build

# Start production server
npm run start:prod
```

### Testing Scripts
```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:cov

# Run E2E tests
npm run test:e2e

# Run all tests (unit + E2E)
npm run test:all
```

### Database Scripts
```bash
# Run database migrations
npm run db:migrate

# Rollback last migration
npm run db:migrate:undo

# Run database seeders
npm run db:seed

# Rollback all seeders
npm run db:seed:undo

# Reset database (rollback + migrate + seed)
npm run db:reset
```

### Code Quality Scripts
```bash
# Lint and fix code
npm run lint

# Format code with Prettier
npm run format

# Clean build artifacts
npm run clean
```

## 🚀 Deployment

### Environment Variables

Create a `.env` file based on `env.example`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_secure_password
DB_NAME=event_management

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-64-characters-long
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-minimum-64-characters
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Application Configuration
PORT=3000
NODE_ENV=production

# CORS Configuration
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp

# Security
LOG_LEVEL=info
ENABLE_LOGGING=true
```

### Production Deployment

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for comprehensive deployment instructions including:
- Docker deployment
- Cloud platform deployment (AWS, Heroku, Vercel)
- Traditional server deployment
- CI/CD pipeline setup

## 📋 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DB_HOST` | Database host | `localhost` | ✅ |
| `DB_PORT` | Database port | `3306` | ❌ |
| `DB_USERNAME` | Database username | `root` | ✅ |
| `DB_PASSWORD` | Database password | - | ✅ |
| `DB_NAME` | Database name | `event_management` | ✅ |
| `JWT_SECRET` | JWT secret key | - | ✅ |
| `JWT_REFRESH_SECRET` | Refresh token secret | - | ✅ |
| `JWT_EXPIRES_IN` | Access token expiry | `24h` | ❌ |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | `7d` | ❌ |
| `PORT` | Application port | `3000` | ❌ |
| `NODE_ENV` | Environment | `development` | ❌ |
| `ALLOWED_ORIGINS` | CORS origins | `http://localhost:3000` | ❌ |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` | ❌ |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` | ❌ |
| `MAX_FILE_SIZE` | Max upload file size | `5242880` | ❌ |
| `ALLOWED_FILE_TYPES` | Allowed MIME types | `image/jpeg,image/png...` | ❌ |
| `LOG_LEVEL` | Logging level | `info` | ❌ |
| `ENABLE_LOGGING` | Enable logging | `true` | ❌ |

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Errors
```bash
# Check MySQL service status
sudo systemctl status mysql

# Start MySQL service
sudo systemctl start mysql

# Check database exists
mysql -u root -p
SHOW DATABASES;
```

#### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm run start:dev
```

#### JWT Token Errors
- Ensure `JWT_SECRET` is set in `.env`
- Verify token is included in Authorization header
- Check token expiration settings

#### File Upload Issues
- Check file size limits (`MAX_FILE_SIZE`)
- Verify file type is allowed (`ALLOWED_FILE_TYPES`)
- Ensure `uploads/` directory exists and is writable

#### Migration Errors
```bash
# Check migration status
npx sequelize-cli db:migrate:status

# Rollback and retry
npm run db:migrate:undo
npm run db:migrate
```

#### Permission Denied
```bash
# Fix uploads directory permissions
chmod 755 uploads/

# Fix Node.js permissions
sudo chown -R $(whoami) ~/.npm
```

### Debug Mode

Start the application in debug mode:
```bash
npm run start:debug
```

Then attach your debugger to port 9229.

### Logging

Enable detailed logging:
```env
LOG_LEVEL=debug
ENABLE_LOGGING=true
```

Check application logs:
```bash
# Development
npm run start:dev

# Production (with PM2)
pm2 logs event-api
```

### Performance Issues

#### Database Performance
- Check database indexes
- Monitor slow queries
- Optimize query patterns

#### Memory Issues
```bash
# Check memory usage
node --inspect --max-old-space-size=4096 dist/src/main.js

# Monitor with PM2
pm2 monit
```

### Getting Help

1. **Check Documentation**: Review [docs/](docs/) directory
2. **Search Issues**: Look for similar issues on GitHub
3. **Create Issue**: Provide detailed information:
   - Node.js version
   - MySQL version
   - Operating system
   - Error messages
   - Steps to reproduce

## �📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help

- **📚 Documentation**: Check the [docs/](docs/) directory for comprehensive guides
- **🌐 API Docs**: Interactive documentation at [http://localhost:3000/api](http://localhost:3000/api)
- **🐛 Issues**: Create an issue on GitHub with detailed information
- **🔒 Security**: Report security vulnerabilities privately to [security@example.com]
- **💬 Discussions**: Join GitHub Discussions for questions and community support

### Project Status

- **Build Status**: ✅ Passing
- **Test Coverage**: 95%+
- **Security**: OWASP Top 10 Compliant
- **Documentation**: Comprehensive
- **Maintenance**: Actively maintained

---

<div align="center">

**Made with ❤️ by [Rahul Baraiya](https://github.com/rahulbaraiya)**

⭐ Star this repository if it helped you!

</div>
mysql -u your_username -p your_database
```

#### Port Conflicts
```bash
# Check if port 3000 is in use
netstat -tulpn | grep :3000

# Kill process using port 3000
kill -9 $(lsof -t -i:3000)
```

#### File Upload Issues
```bash
# Check uploads directory permissions
ls -la uploads/

# Create uploads directory if missing
mkdir -p uploads
chmod 755 uploads
```

---

**Made with ❤️ by [Your Name]**

For questions and support, please open an issue on GitHub.