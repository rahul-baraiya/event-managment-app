# Use Node.js LTS version
FROM node:18-alpine

# Install curl for health check
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies without scripts
RUN yarn install --frozen-lockfile --ignore-scripts

# Copy source code and configuration files
COPY . .

# Build the application
RUN yarn build

# Remove development dependencies to reduce image size
RUN yarn install --frozen-lockfile --production --ignore-scripts && yarn cache clean

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "dist/src/main"] 