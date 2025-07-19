# 🔄 Migration Guide

This guide helps you migrate between different versions of the Event Management API.

## 📋 Table of Contents

- [General Migration Steps](#general-migration-steps)
- [Version-Specific Migrations](#version-specific-migrations)
- [Database Migrations](#database-migrations)
- [Configuration Changes](#configuration-changes)
- [API Changes](#api-changes)
- [Breaking Changes](#breaking-changes)

## 🚀 General Migration Steps

### Before Migration

1. **Backup Your Data**
   ```bash
   # Backup database
   mysqldump -u username -p event_management > backup_$(date +%Y%m%d).sql
   
   # Backup uploaded files
   tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/
   ```

2. **Document Current Configuration**
   ```bash
   # Save current environment
   cp .env .env.backup
   
   # Note current version
   git tag --list | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$' | sort -V | tail -1
   ```

3. **Test in Development First**
   - Always test migrations in a development environment
   - Verify all functionality works after migration
   - Test with production-like data volume

### Migration Process

1. **Update Codebase**
   ```bash
   git fetch origin
   git checkout main
   git pull origin main
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Database Migrations**
   ```bash
   npm run db:migrate
   ```

4. **Update Configuration**
   - Compare `.env.example` with your `.env`
   - Add any new required environment variables
   - Update deprecated configuration options

5. **Test Application**
   ```bash
   npm test
   npm run test:e2e
   ```

6. **Start Application**
   ```bash
   npm run start:prod
   ```

## 📊 Version-Specific Migrations

### From v0.x.x to v1.0.0

This is a major version upgrade with significant changes.

#### Breaking Changes
- Complete API restructure
- New authentication system
- Database schema changes
- New environment variables required

#### Migration Steps

1. **New Environment Variables**
   ```env
   # Add to your .env file
   JWT_SECRET=your-new-jwt-secret-minimum-64-characters
   JWT_REFRESH_SECRET=your-refresh-secret-minimum-64-characters
   JWT_EXPIRES_IN=24h
   JWT_REFRESH_EXPIRES_IN=7d
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   MAX_FILE_SIZE=5242880
   ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
   LOG_LEVEL=info
   ENABLE_LOGGING=true
   ```

2. **Database Migration**
   ```bash
   # Run all migrations
   npm run db:migrate
   ```

3. **API Changes**
   - All endpoints now require authentication
   - Response format has changed
   - New pagination parameters
   - File upload endpoints changed

4. **Authentication Changes**
   - Old session-based auth removed
   - New JWT-based authentication
   - Refresh token support added
   - Role-based access control implemented

### Future Version Migrations

#### v1.0.x to v1.1.x (Minor Updates)
Minor version updates typically include:
- New features (backward compatible)
- Bug fixes
- Performance improvements
- Additional configuration options

Migration is usually straightforward:
```bash
git pull origin main
npm install
npm run db:migrate
```

#### v1.x.x to v2.0.0 (Major Updates)
Major version updates may include:
- Breaking API changes
- Database schema changes
- New system requirements
- Configuration restructure

Always check the specific migration guide for the version.

## 🗄️ Database Migrations

### Understanding Migrations

Migrations are versioned database changes that:
- Alter database schema
- Add/remove tables or columns
- Modify indexes or constraints
- Update existing data

### Running Migrations

```bash
# Check migration status
npx sequelize-cli db:migrate:status

# Run pending migrations
npm run db:migrate

# Rollback last migration (if needed)
npm run db:migrate:undo

# Rollback to specific migration
npx sequelize-cli db:migrate:undo:all --to XXXXXXXXXXXXXX-migration-name.js
```

### Migration Rollback Strategy

If migration fails:

1. **Stop the application**
2. **Restore from backup**
   ```bash
   mysql -u username -p event_management < backup_YYYYMMDD.sql
   ```
3. **Fix the issue**
4. **Retry migration**

### Custom Migration Scripts

For complex migrations, we may provide custom scripts:

```bash
# Run custom migration script
node scripts/migrate-v1-to-v2.js
```

## ⚙️ Configuration Changes

### Environment Variable Changes

#### Added Variables
Check `env.example` for new variables and their descriptions.

#### Deprecated Variables
- Remove deprecated variables from `.env`
- Check documentation for replacements

#### Changed Variables
- Update variable names if changed
- Verify new value formats

### Configuration File Changes

#### Database Configuration
```javascript
// config/database.js - check for updates
module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    // New configuration options may be added
  }
};
```

## 🔌 API Changes

### Endpoint Changes

#### New Endpoints
Check [API.md](API.md) for new endpoints added in each version.

#### Modified Endpoints
- Request/response format changes
- New required parameters
- Authentication requirements

#### Deprecated Endpoints
- Plan migration away from deprecated endpoints
- Use new recommended endpoints

### Authentication Changes

#### JWT Implementation (v1.0.0)
```javascript
// Old: Session-based (removed)
// No authorization header needed

// New: JWT-based
headers: {
  'Authorization': 'Bearer your-jwt-token'
}
```

### Response Format Changes

#### Standardized Format (v1.0.0)
```javascript
// Old format
{
  "id": 1,
  "title": "Event Title"
}

// New format
{
  "data": {
    "id": 1,
    "title": "Event Title"
  },
  "message": "Success"
}
```

## ⚠️ Breaking Changes

### v1.0.0 Breaking Changes

1. **Authentication Required**
   - All endpoints now require authentication
   - JWT tokens must be included in requests

2. **Response Format Changed**
   - All responses now follow standard format
   - Data is wrapped in `data` property

3. **File Upload Changes**
   - New upload endpoints
   - Different file validation rules
   - Changed file naming convention

4. **Database Schema Changes**
   - New tables added
   - Column types changed
   - New relationships established

5. **Environment Variables**
   - Many new required variables
   - Some variables renamed
   - Deprecated variables removed

### Handling Breaking Changes

1. **Update Client Applications**
   ```javascript
   // Update API calls
   const response = await fetch('/api/events', {
     headers: {
       'Authorization': `Bearer ${token}`,
       'Content-Type': 'application/json'
     }
   });
   
   // Handle new response format
   const { data } = await response.json();
   ```

2. **Update Authentication**
   ```javascript
   // Implement JWT authentication
   const loginResponse = await fetch('/api/auth/login', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ username, password })
   });
   
   const { access_token } = await loginResponse.json();
   ```

## 🧪 Testing After Migration

### Verification Checklist

- [ ] Application starts without errors
- [ ] Database connections work
- [ ] Authentication flows work
- [ ] All API endpoints respond correctly
- [ ] File uploads work
- [ ] Existing data is intact
- [ ] New features work as expected

### Test Commands

```bash
# Run all tests
npm run test:all

# Test specific functionality
npm run test:e2e

# Manual testing
curl -X GET http://localhost:3000/health
```

## 🆘 Troubleshooting Migration Issues

### Common Issues

#### Migration Fails
```bash
# Check migration status
npx sequelize-cli db:migrate:status

# Check error logs
npm run start:dev

# Rollback if needed
npm run db:migrate:undo
```

#### Environment Variable Errors
```bash
# Verify all required variables are set
node -e "console.log(process.env)" | grep -E "(DB_|JWT_|NODE_)"
```

#### Authentication Issues
- Verify JWT secrets are set
- Check token format in requests
- Ensure proper authorization headers

#### File Upload Issues
- Check upload directory permissions
- Verify file size and type limits
- Test with different file types

### Getting Help

1. **Check Logs**: Review application and database logs
2. **Verify Configuration**: Compare with `env.example`
3. **Test Step by Step**: Isolate the issue
4. **Create Issue**: If problem persists, create GitHub issue with:
   - Source version
   - Target version
   - Error messages
   - Migration steps attempted

## 📞 Support

For migration support:
- **GitHub Issues**: Create issue with `migration` label
- **Documentation**: Check version-specific docs
- **Community**: GitHub Discussions for help

---

**Note**: Always test migrations in a development environment first and maintain backups of your production data.
