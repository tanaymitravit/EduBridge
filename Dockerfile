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

# Set environment to production
ENV NODE_ENV=production

# Install dependencies
RUN npm install

# Create tsconfig.json if it doesn't exist
RUN if [ ! -f "tsconfig.json" ]; then \
      echo '{"compilerOptions":{"target":"ES2020","useDefineForClassFields":true,"lib":["ES2020","DOM","DOM.Iterable"],"module":"ESNext","skipLibCheck":true,"moduleResolution":"node","resolveJsonModule":true,"isolatedModules":true,"jsx":"react-jsx"}}' > tsconfig.json; \
    fi

# Build the application
RUN npx vite build

# Create public directory
RUN mkdir -p /app/server/public

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/

# Install production dependencies
RUN npm install --production
WORKDIR /app/server
RUN npm install --production

# Copy built frontend
COPY --from=frontend-builder /app/apps/web/dist /app/server/public

# Copy backend
COPY server/ ./

# Expose port
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:10000/api/ping || exit 1

# Start server
CMD ["node", "server.js"]
