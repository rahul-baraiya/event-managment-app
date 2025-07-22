# Swagger/OpenAPI Documentation

## Overview

The Event Management API includes comprehensive Swagger/OpenAPI documentation that provides an interactive interface for testing and exploring all available endpoints.

## Access the Documentation

- **Local Development**: `http://localhost:3001/api`
- **Production**: `https://your-domain.com/api`

## Features

### 🎯 Comprehensive API Documentation

- **Interactive UI**: Full Swagger UI with try-it-out functionality
- **Authentication Support**: Built-in JWT Bearer token authentication
- **Multiple Servers**: Development, staging, and production server configurations
- **Rich Metadata**: Detailed API information, contact details, and license information

### 📋 Documented Endpoints

#### Authentication (`/auth`)

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile (requires auth)
- `PUT /auth/update/:id` - Update user profile (requires auth)
- `DELETE /auth/delete/:id` - Delete user account (requires auth)

#### Events (`/events`)

- `POST /events` - Create new event with file upload support (requires auth)
- `GET /events` - Get all events with filtering and pagination
- `GET /events/:id` - Get specific event by ID
- `PUT /events/:id` - Update event with file upload support (requires auth)
- `DELETE /events/:id` - Delete event (requires auth)

#### Users (`/users`)

- `POST /users` - Create new user
- `GET /users` - Get all users
- `GET /users/:id` - Get specific user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

#### File Uploads (`/uploads`)

- `POST /uploads` - Upload files with validation (requires auth)

#### Health Check (`/health`)

- `GET /health` - API health status

### 🔒 Security Features

#### JWT Authentication

- **Scheme**: Bearer token authentication
- **Header**: `Authorization: Bearer <token>`
- **Scope**: Applied to all protected endpoints
- **Auto-configuration**: Pre-configured in Swagger UI

#### Security Response Codes

- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found

### 📝 Request/Response Documentation

#### Detailed Schemas

- **Request Bodies**: Complete schema definitions with examples
- **Response Models**: Structured response formats
- **File Uploads**: Multipart form data support with file type validation
- **Error Responses**: Standardized error response schemas

#### Example Values

All endpoints include realistic example values:

```json
{
  "title": "Summer Music Festival",
  "description": "A wonderful summer music festival with live performances",
  "startDate": "2024-07-15T18:00:00Z",
  "endDate": "2024-07-15T22:00:00Z",
  "totalGuests": 100,
  "category": "Music",
  "location": "Central Park, New York",
  "price": 50.0
}
```

### 🎨 UI Customization

#### Enhanced Swagger UI

- **Custom Title**: "Event Management API - Documentation"
- **Detailed Description**: Comprehensive API overview
- **Server Information**: Multiple environment configurations
- **Contact Information**: Support and development contact details
- **License**: MIT License with link

#### Organized Structure

- **Tags**: Logical grouping of endpoints
- **Operation IDs**: Unique identifiers for each operation
- **Summary & Description**: Clear, concise endpoint descriptions

## Configuration

### Main Configuration (`src/main.ts`)

```typescript
const config = new DocumentBuilder()
  .setTitle('Event Management API')
  .setDescription(
    'Comprehensive API for managing events, users, and file uploads...',
  )
  .setVersion('1.0.0')
  .addBearerAuth()
  .addServer('http://localhost:3001', 'Development server')
  .addServer('https://event-managment-app.onrender.com', 'Production server')
  .setContact(
    'API Support',
    'https://yourdomain.com/support',
    'support@yourdomain.com',
  )
  .setLicense('MIT', 'https://opensource.org/licenses/MIT')
  .addTag('auth', 'Authentication and user management')
  .addTag('events', 'Event management operations')
  .addTag('users', 'User CRUD operations')
  .addTag('uploads', 'File upload operations')
  .addTag('health', 'System health monitoring')
  .build();
```

### Controller Decorators

Each controller uses comprehensive Swagger decorators:

- `@ApiTags()` - Endpoint grouping
- `@ApiOperation()` - Operation description
- `@ApiResponse()` - Response documentation
- `@ApiBearerAuth()` - Authentication requirement
- `@ApiBody()` - Request body schema
- `@ApiConsumes()` - Content type specification

### DTO Documentation

All DTOs include `@ApiProperty()` decorators with:

- Property descriptions
- Example values
- Validation rules
- Required/optional indicators
- Data types and formats

## Testing with Swagger UI

### 1. Authentication

1. Register a new user via `POST /auth/register`
2. Login via `POST /auth/login` to get JWT token
3. Click "Authorize" button in Swagger UI
4. Enter token in format: `Bearer <your-jwt-token>`

### 2. Testing Endpoints

1. Navigate to any endpoint
2. Click "Try it out"
3. Fill in required parameters
4. Execute the request
5. View response data and status codes

### 3. File Upload Testing

1. Authenticate first
2. Navigate to `POST /uploads` or `POST /events`
3. Use "Choose File" to select images
4. Fill in other required fields
5. Execute to test file upload functionality

## Best Practices

### API Documentation

- Keep descriptions clear and concise
- Include realistic example values
- Document all possible response codes
- Maintain consistent naming conventions

### Schema Design

- Use proper data types and formats
- Include validation constraints
- Provide meaningful property descriptions
- Structure nested objects clearly

### Authentication

- Always test protected endpoints with valid tokens
- Include proper error handling documentation
- Specify token expiration information

## Troubleshooting

### Common Issues

#### 401 Unauthorized

- Ensure you're logged in and have a valid token
- Check token format: `Bearer <token>`
- Verify token hasn't expired

#### 400 Bad Request

- Check required fields are provided
- Validate data types match schema
- Ensure file uploads meet size/type requirements

#### CORS Issues

- API is configured with appropriate CORS settings
- Contact support if accessing from different domains

### Support

- **Documentation**: `/docs` folder
- **API Support**: support@yourdomain.com
- **GitHub Issues**: Create issues for bugs or feature requests

## Future Enhancements

### Planned Features

- [ ] API versioning documentation
- [ ] Rate limiting information
- [ ] Webhook documentation
- [ ] SDK generation
- [ ] Advanced filtering examples
- [ ] Bulk operations documentation

### Integration Examples

- [ ] cURL examples for all endpoints
- [ ] JavaScript/Node.js examples
- [ ] Python integration examples
- [ ] Postman collection export
