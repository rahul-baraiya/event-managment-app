# 🔒 Security Documentation

This document outlines the security measures implemented in the Event Management API and best practices for maintaining security.

## 🛡️ Security Overview

The Event Management API implements comprehensive security measures following OWASP Top 10 guidelines and industry best practices.

## 🔐 Authentication & Authorization

### JWT (JSON Web Tokens)

#### Access Tokens

- **Algorithm**: HS256
- **Expiration**: 24 hours (configurable)
- **Payload**: User ID, username, roles
- **Secret**: Environment variable `JWT_SECRET`

#### Implementation

```typescript
// JWT Strategy
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      username: payload.username,
      roles: payload.roles,
    };
  }
}
```

### Password Security

#### Hashing

- **Algorithm**: bcrypt
- **Salt Rounds**: 12
- **Implementation**:

```typescript
const saltRounds = 12;
const hashedPassword = await bcrypt.hash(password, saltRounds);
```

#### Password Policy

- Minimum 8 characters
- Must contain uppercase letter
- Must contain lowercase letter
- Must contain number
- Must contain special character

### Role-Based Access Control (RBAC)

#### Roles

- **User**: Basic user permissions
- **Admin**: Full system access
- **Moderator**: Limited admin permissions

#### Implementation

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Get('admin-only')
adminOnlyEndpoint() {
  // Admin-only logic
}
```

## 🌐 Web Security

### CORS (Cross-Origin Resource Sharing)

#### Configuration

```typescript
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:3001',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
```

### Security Headers (Helmet.js)

#### Headers Applied

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `Content-Security-Policy: default-src 'self'`

#### Configuration

```typescript
const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
};
```

### Rate Limiting

#### Configuration

- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Headers**: Includes rate limit information

#### Implementation

```typescript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
```

## 🧹 Input Validation & Sanitization

### Validation (class-validator)

#### Example DTO

```typescript
export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  @ApiProperty()
  title: string;

  @IsString()
  @IsOptional()
  @Length(0, 5000)
  @ApiProperty()
  description?: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty()
  startDate: Date;
}
```

### Sanitization Middleware

#### HTML/XSS Sanitization

```typescript
@Injectable()
export class SanitizeMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    this.sanitizeObject(req.body);
    this.sanitizeObject(req.query);
    this.sanitizeObject(req.params);
    next();
  }

  private sanitizeObject(obj: any) {
    if (!obj) return;

    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = DOMPurify.sanitize(obj[key]);
      } else if (typeof obj[key] === 'object') {
        this.sanitizeObject(obj[key]);
      }
    }
  }
}
```

## 🗄️ Database Security

### SQL Injection Prevention

#### Parameterized Queries (Sequelize)

```typescript
// Safe - Sequelize handles parameterization
const events = await this.eventModel.findAll({
  where: {
    title: {
      [Op.like]: `%${searchTerm}%`,
    },
  },
});

// Unsafe - Never do this
const events = await sequelize.query(
  `SELECT * FROM Events WHERE title LIKE '%${searchTerm}%'`,
);
```

### Database Connection Security

- Use environment variables for credentials
- Implement connection pooling
- Use SSL for database connections in production

#### Secure Connection Example

```typescript
SequelizeModule.forRoot({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.NODE_ENV === 'production',
  dialectOptions: {
    ssl:
      process.env.NODE_ENV === 'production'
        ? {
            require: true,
            rejectUnauthorized: false,
          }
        : false,
  },
});
```

## 📁 File Upload Security

### File Type Validation

```typescript
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

const fileFilter = (req: any, file: any, cb: any) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};
```

### File Size Limits

```typescript
const upload = multer({
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter,
});
```

### Secure File Serving

```typescript
app.useStaticAssets(join(__dirname, '..', 'uploads'), {
  prefix: '/uploads/',
  setHeaders: (res) => {
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('X-Frame-Options', 'DENY');
  },
});
```

## 📊 Logging & Monitoring

### Security Event Logging

#### Custom Logger Service

```typescript
@Injectable()
export class LoggerService {
  logSecurityEvent(event: string, details?: any, context?: string) {
    this.warn(`SECURITY EVENT: ${event}`, context);
    if (details) {
      this.debug(`Details: ${JSON.stringify(details)}`, context);
    }
  }

  logApiRequest(method: string, url: string, ip: string, context?: string) {
    this.log(`API Request: ${method} ${url} from ${ip}`, context);
  }
}
```

#### Security Events to Log

- Failed login attempts
- Invalid JWT tokens
- Rate limit violations
- File upload rejections
- SQL injection attempts
- XSS attempts

### Request/Response Logging

#### Logging Interceptor

```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const now = Date.now();

    this.logger.logApiRequest(method, url, ip);

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const delay = Date.now() - now;
          this.logger.log(`${method} ${url} ${response.statusCode} ${delay}ms`);
        },
        error: (error) => {
          const delay = Date.now() - now;
          this.logger.error(
            `${method} ${url} ${error.status || 500} ${delay}ms - ${
              error.message
            }`,
          );
        },
      }),
    );
  }
}
```

## 🚨 Error Handling

### Secure Error Responses

#### Exception Filter

```typescript
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = 500;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    // Don't expose internal errors in production
    if (status === 500 && process.env.NODE_ENV === 'production') {
      message = 'Internal server error';
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

## 🔧 Environment Security

### Environment Variables

#### Required Security Variables

```env
# JWT Configuration (Use strong secrets)
JWT_SECRET=your-super-long-random-production-jwt-secret-minimum-64-chars

# Database Security
DB_PASSWORD=your-secure-database-password

# Application Security
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Best Practices

- Use different secrets for different environments
- Rotate secrets regularly
- Never commit secrets to version control
- Use secret management tools in production

## 🔍 Security Testing

### Security Test Examples

#### Authentication Tests

```typescript
describe('Authentication Security', () => {
  it('should reject invalid JWT tokens', async () => {
    return request(app.getHttpServer())
      .get('/events')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);
  });

  it('should reject weak passwords', async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: 'test',
        email: 'test@example.com',
        password: '123', // Weak password
      })
      .expect(400);
  });
});
```

#### Rate Limiting Tests

```typescript
describe('Rate Limiting', () => {
  it('should enforce rate limits', async () => {
    // Make 101 requests rapidly
    const requests = Array(101)
      .fill(null)
      .map(() => request(app.getHttpServer()).get('/events'));

    const responses = await Promise.all(requests);

    // Last request should be rate limited
    expect(responses[100].status).toBe(429);
  });
});
```

## 🚀 Production Security Checklist

### Pre-Deployment

- [ ] All environment variables configured
- [ ] Strong JWT secrets generated
- [ ] Database credentials secured
- [ ] CORS origins restricted
- [ ] Rate limiting configured
- [ ] File upload limits set
- [ ] Security headers enabled
- [ ] Error handling sanitized
- [ ] Logging configured

### Infrastructure

- [ ] HTTPS/TLS enabled
- [ ] Firewall configured
- [ ] Database access restricted
- [ ] Regular backups enabled
- [ ] Monitoring set up
- [ ] Security updates automated

### Ongoing Security

- [ ] Regular dependency updates
- [ ] Security log monitoring
- [ ] Penetration testing
- [ ] Code security reviews
- [ ] Incident response plan

## 🔗 Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NestJS Security](https://docs.nestjs.com/security/authentication)
- [JWT Security Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
