# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies without postinstall script
RUN yarn install --frozen-lockfile --ignore-scripts

# Copy TypeScript configuration files
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Copy source code
COPY src/ ./src/
COPY .sequelizerc ./
COPY config/ ./config/
COPY migrations/ ./migrations/

# Build the application
RUN yarn build

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "dist/src/main"] 