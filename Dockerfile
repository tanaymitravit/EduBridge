# Stage 1: Build the frontend
FROM node:18-alpine as frontend-builder

# Set working directory
WORKDIR /app

# Install necessary build tools
RUN apk add --no-cache python3 make g++

# Copy package files first for better caching
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/

# Install root dependencies
RUN npm install

# Copy the rest of the application
WORKDIR /app
COPY . .

# Build frontend
WORKDIR /app/apps/web
RUN npm install
RUN npm install -D vite@latest @vitejs/plugin-react@latest
RUN npm run build

# Create public directory if it doesn't exist
RUN mkdir -p /app/server/public

# Stage 2: Build the backend
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/

# Install production dependencies only
RUN npm install --production

# Install server dependencies
WORKDIR /app/server
RUN npm install --production

# Copy built frontend from previous stage
COPY --from=frontend-builder /app/apps/web/dist /app/server/public

# Ensure the public directory has the correct permissions
RUN chmod -R 755 /app/server/public

# Copy the rest of the application
WORKDIR /app
COPY . .

# Set working directory to server
WORKDIR /app/server

# Expose the port the app runs on
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:10000/api/ping || exit 1

# Start the application
CMD ["node", "server.js"]
