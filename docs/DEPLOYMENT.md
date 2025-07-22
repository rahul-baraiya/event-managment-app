# 🚀 Deployment Guide

This guide covers different deployment strategies for the Event Management API.

## 📋 Prerequisites

- Node.js 16+
- MySQL 8.0+
- Docker (optional)
- Git

## 🐳 Docker Deployment (Recommended)

### Quick Start with Docker Compose

1. **Clone and configure:**

```bash
git clone git@github.com:rahul-baraiya/event-managment-app.git
cd event-management-app
cp env.example .env
```

2. **Configure environment:**

```bash
# Edit .env file with your settings
nano .env
```

3. **Start with Docker Compose:**

```bash
docker-compose up -d
```

The application will be available at `http://localhost:3000`

### Manual Docker Setup

1. **Build the image:**

```bash
docker build -t event-management-api .
```

2. **Run MySQL container:**

```bash
docker run -d \
  --name mysql-db \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=event_management \
  -p 3306:3306 \
  mysql:8.0
```

3. **Run the application:**

```bash
docker run -d \
  --name event-api \
  --link mysql-db:mysql \
  -p 3000:3000 \
  -e DB_HOST=mysql \
  -e DB_PASSWORD=rootpassword \
  event-management-api
```

## 🏗️ Traditional Deployment

### Ubuntu/Debian Server

1. **Install Node.js:**

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Install MySQL:**

```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

3. **Create database:**

```bash
mysql -u root -p
CREATE DATABASE event_management;
CREATE USER 'api_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON event_management.* TO 'api_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

4. **Deploy application:**

```bash
git clone git@github.com:rahul-baraiya/event-managment-app.git
cd event-management-app
npm install
cp env.example .env
# Edit .env with your database credentials
npm run build
npm run db:migrate
```

5. **Use PM2 for production:**

```bash
npm install -g pm2
pm2 start dist/src/main.js --name "event-api"
pm2 startup
pm2 save
```

## ☁️ Cloud Deployment

### AWS EC2 + RDS

1. **Setup RDS MySQL:**

   - Create MySQL 8.0 RDS instance
   - Configure security groups
   - Note the endpoint and credentials

2. **Setup EC2:**

   - Launch Ubuntu 20.04 LTS instance
   - Configure security groups (allow 22, 80, 443, 3000)
   - SSH into instance

3. **Deploy application:**

```bash
# Install Node.js and dependencies
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs git nginx

# Clone and setup app
git clone git@github.com:rahul-baraiya/event-managment-app.git
cd event-management-app
npm install
cp env.example .env

# Configure environment for RDS
nano .env
# Set DB_HOST to your RDS endpoint
# Set DB_USERNAME, DB_PASSWORD, DB_NAME

# Build and migrate
npm run build
npm run db:migrate

# Install PM2
npm install -g pm2
pm2 start dist/src/main.js --name "event-api"
pm2 startup
pm2 save
```

4. **Configure Nginx:**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Heroku Deployment

1. **Prepare for Heroku:**

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login
```

2. **Create Heroku app:**

```bash
heroku create your-app-name
```

3. **Add MySQL addon:**

```bash
heroku addons:create jawsdb:kitefin
```

4. **Configure environment:**

```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-production-jwt-secret
```

5. **Deploy:**

```bash
git push heroku main
heroku run npm run db:migrate
```

### Vercel Deployment

1. **Install Vercel CLI:**

```bash
npm install -g vercel
```

2. **Create vercel.json:**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/src/main.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/src/main.js"
    }
  ]
}
```

3. **Deploy:**

```bash
npm run build
vercel --prod
```

## 🔧 Environment Configuration

### Production Environment Variables

```env
# Database Configuration
DB_HOST=your-production-db-host
DB_PORT=3306
DB_USERNAME=your-db-user
DB_PASSWORD=your-secure-db-password
DB_NAME=event_management

# JWT Configuration (Use strong secrets in production)
JWT_SECRET=your-super-long-random-production-jwt-secret-here-minimum-64-chars
JWT_EXPIRES_IN=15m

# Application Configuration
PORT=3000
NODE_ENV=production

# CORS Configuration
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Rate Limiting (Adjust based on your needs)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp

# Security
LOG_LEVEL=warn
ENABLE_LOGGING=true
```

## 🔒 Security Checklist

- [ ] Use strong JWT secrets (64+ characters)
- [ ] Configure proper CORS origins
- [ ] Set up SSL/TLS certificates
- [ ] Use environment variables for all secrets
- [ ] Configure proper database user permissions
- [ ] Set up firewall rules
- [ ] Enable logging and monitoring
- [ ] Configure rate limiting appropriately
- [ ] Use HTTPS only in production
- [ ] Set up database backups
- [ ] Configure security headers
- [ ] Validate file uploads

## 📊 Monitoring Setup

### PM2 Monitoring

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

### Health Checks

Setup monitoring for the health endpoint:

```bash
curl http://localhost:3000/health
```

### Log Management

```bash
# View logs
pm2 logs

# Rotate logs
pm2 flush
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build application
        run: npm run build

      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.2
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /path/to/your/app
            git pull origin main
            npm install
            npm run build
            npm run db:migrate
            pm2 restart event-api
```

## 🛠️ Maintenance

### Database Migrations

```bash
# Create new migration
npx sequelize-cli migration:generate --name add-new-field

# Run migrations
npm run db:migrate

# Rollback migration
npm run db:migrate:undo
```

### Backups

```bash
# Backup database
mysqldump -u username -p event_management > backup.sql

# Restore database
mysql -u username -p event_management < backup.sql
```

### Updates

```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```
