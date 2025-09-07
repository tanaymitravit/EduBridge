#!/bin/bash

set -e  # Exit on any error

echo "🚀 Starting EduBridge build process..."

# Set project root
if [ -z "$RENDER" ]; then
    PROJECT_ROOT=.
else
    PROJECT_ROOT=/opt/render/project/src
fi

echo "📦 Project root: $PROJECT_ROOT"

# Install root dependencies
echo "📦 Installing root dependencies..."
cd $PROJECT_ROOT
npm install

# Install and build frontend
echo "🎨 Building frontend..."
cd $PROJECT_ROOT/apps/web
npm install
npm install -D vite@latest
npm run build

# Verify build
if [ ! -f "dist/index.html" ]; then
    echo "❌ Frontend build failed - dist/index.html not found"
    ls -la dist/ 2>/dev/null || echo "dist/ directory does not exist"
    exit 1
fi

echo "✅ Frontend built successfully"

# Copy frontend build to server public directory
mkdir -p $PROJECT_ROOT/server/public
echo "📁 Copying frontend files to server/public..."
cp -r $PROJECT_ROOT/apps/web/dist/* $PROJECT_ROOT/server/public/

# Install backend dependencies
echo "🔧 Installing backend dependencies..."
cd $PROJECT_ROOT/server
npm install

echo "✅ Backend dependencies installed"

echo "🎉 Build completed successfully!"
echo "📁 Frontend build location: apps/web/dist/"
echo "🔧 Backend location: server/"
