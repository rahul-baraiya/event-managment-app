# API Quick Reference

## Base URL
- **Development**: `http://localhost:3001`
- **Documentation**: `http://localhost:3001/api`

## Authentication
```bash
# 1. Register
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# 2. Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# 3. Use token in subsequent requests
curl -X GET http://localhost:3001/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Events
```bash
# Create Event
curl -X POST http://localhost:3001/events \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Summer Concert","startDate":"2024-07-15T18:00:00Z","endDate":"2024-07-15T22:00:00Z","totalGuests":100,"category":"Music"}'

# Get All Events
curl -X GET http://localhost:3001/events

# Get Event by ID
curl -X GET http://localhost:3001/events/1

# Update Event
curl -X PUT http://localhost:3001/events/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Summer Concert","totalGuests":150}'

# Delete Event
curl -X DELETE http://localhost:3001/events/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## File Upload
```bash
# Upload File
curl -X POST http://localhost:3001/uploads \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/your/image.jpg"
```

## Health Check
```bash
curl -X GET http://localhost:3001/health
```

## Response Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Data Formats
- **Dates**: ISO 8601 format (`2024-07-15T18:00:00Z`)
- **Files**: Supported formats: JPG, JPEG, PNG, GIF, WebP (max 5MB)
- **Authentication**: Bearer token in Authorization header
