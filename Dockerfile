# Use Node.js LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY server/package*.json ./server/

# Install root dependencies
RUN npm install

# Install frontend dependencies
WORKDIR /app/apps/web
RUN npm install

# Build frontend
RUN npm run build

# Install backend dependencies
WORKDIR /app/server
RUN npm install

# Copy the rest of the application
WORKDIR /app
COPY . .

# Copy frontend build to server public directory
RUN mkdir -p /app/server/public
RUN cp -r /app/apps/web/dist/* /app/server/public/

# Set working directory to server
WORKDIR /app/server

# Expose the port the app runs on
EXPOSE 10000

# Start the application
CMD ["node", "server.js"]
