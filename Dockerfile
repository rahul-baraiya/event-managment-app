# Use Node.js LTS version
FROM node:18-alpine

# Install dependencies needed for native modules and curl for health check
RUN apk add --no-cache \
    curl \
    python3 \
    make \
    g++ \
    && ln -sf python3 /usr/bin/python

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install all dependencies first (including dev dependencies for building)
RUN yarn install --frozen-lockfile

# Copy source code and configuration files
COPY . .

# Build the application
RUN yarn build

# Remove development dependencies and rebuild production dependencies
RUN yarn install --production --frozen-lockfile && yarn cache clean

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "dist/src/main"] 