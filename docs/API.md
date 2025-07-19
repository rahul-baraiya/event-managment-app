# 📚 API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 🔐 Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "createdAt": "2025-07-19T12:00:00.000Z",
  "updatedAt": "2025-07-19T12:00:00.000Z"
}
```

### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 🎉 Events Endpoints

### Get All Events
```http
GET /events?page=1&limit=10&search=conference&category=tech&startDate=2025-01-01&endDate=2025-12-31
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search in title and description
- `category` (optional): Filter by category
- `startDate` (optional): Filter events from this date (YYYY-MM-DD)
- `endDate` (optional): Filter events until this date (YYYY-MM-DD)
- `minGuests` (optional): Minimum guest count
- `maxGuests` (optional): Maximum guest count
- `sortBy` (optional): Sort field (title, startDate, createdAt)
- `sortOrder` (optional): Sort order (ASC, DESC)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Tech Conference 2025",
      "description": "Annual technology conference",
      "category": "tech",
      "startDate": "2025-08-15T09:00:00.000Z",
      "endDate": "2025-08-15T17:00:00.000Z",
      "location": "Convention Center",
      "maxGuests": 500,
      "images": ["image1.jpg", "image2.jpg"],
      "status": "active",
      "createdAt": "2025-07-19T12:00:00.000Z",
      "updatedAt": "2025-07-19T12:00:00.000Z",
      "User": {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com"
      }
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

### Get Event by ID
```http
GET /events/:id
```

**Response:**
```json
{
  "id": 1,
  "title": "Tech Conference 2025",
  "description": "Annual technology conference",
  "category": "tech",
  "startDate": "2025-08-15T09:00:00.000Z",
  "endDate": "2025-08-15T17:00:00.000Z",
  "location": "Convention Center",
  "maxGuests": 500,
  "images": ["image1.jpg", "image2.jpg"],
  "status": "active",
  "createdAt": "2025-07-19T12:00:00.000Z",
  "updatedAt": "2025-07-19T12:00:00.000Z",
  "User": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### Create Event
```http
POST /events
Authorization: Bearer <token>
Content-Type: multipart/form-data

title=Tech Conference 2025
description=Annual technology conference
category=tech
startDate=2025-08-15T09:00:00.000Z
endDate=2025-08-15T17:00:00.000Z
location=Convention Center
maxGuests=500
images=@image1.jpg
images=@image2.jpg
```

**Response:**
```json
{
  "id": 1,
  "title": "Tech Conference 2025",
  "description": "Annual technology conference",
  "category": "tech",
  "startDate": "2025-08-15T09:00:00.000Z",
  "endDate": "2025-08-15T17:00:00.000Z",
  "location": "Convention Center",
  "maxGuests": 500,
  "images": ["1690123456789-image1.jpg", "1690123456790-image2.jpg"],
  "status": "active",
  "userId": 1,
  "createdAt": "2025-07-19T12:00:00.000Z",
  "updatedAt": "2025-07-19T12:00:00.000Z"
}
```

### Update Event
```http
PUT /events/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data

title=Updated Tech Conference 2025
description=Updated description
maxGuests=600
images=@new-image.jpg
```

### Delete Event
```http
DELETE /events/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Event deleted successfully"
}
```

## 👥 Users Endpoints

### Get All Users (Admin only)
```http
GET /users
Authorization: Bearer <admin-token>
```

### Get User by ID
```http
GET /users/:id
Authorization: Bearer <token>
```

### Update User
```http
PUT /users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "new_username",
  "email": "new@example.com"
}
```

### Delete User
```http
DELETE /users/:id
Authorization: Bearer <token>
```

## 📁 File Upload Endpoints

### Upload Files
```http
POST /uploads
Authorization: Bearer <token>
Content-Type: multipart/form-data

files=@image1.jpg
files=@image2.jpg
```

**Response:**
```json
{
  "filenames": [
    "1690123456789-image1.jpg",
    "1690123456790-image2.jpg"
  ]
}
```

## ❤️ Health Check

### Health Status
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    },
    "memory_heap": {
      "status": "up"
    },
    "memory_rss": {
      "status": "up"
    }
  },
  "error": {},
  "details": {
    "database": {
      "status": "up"
    },
    "memory_heap": {
      "status": "up"
    },
    "memory_rss": {
      "status": "up"
    }
  }
}
```

## 🚨 Error Responses

### Standard Error Format
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "timestamp": "2025-07-19T12:00:00.000Z",
  "path": "/events"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Too Many Requests
- `500` - Internal Server Error

## 🔒 Security Headers

All responses include security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

## 📊 Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## 🌐 CORS

Allowed origins are configurable via environment variables. Default development origins:
- `http://localhost:3000`
- `http://localhost:3001`
