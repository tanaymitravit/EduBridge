#!/bin/bash

echo "🚀 Starting EduBridge build process..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install and build frontend
echo "🎨 Building frontend..."
cd apps/web
npm install
npm run build

# Verify build
if [ ! -f "dist/index.html" ]; then
    echo "❌ Frontend build failed - dist/index.html not found"
    exit 1
fi

echo "✅ Frontend built successfully"

# Install backend dependencies
echo "🔧 Installing backend dependencies..."
cd ../../server
npm install

echo "✅ Backend dependencies installed"

echo "🎉 Build completed successfully!"
echo "📁 Frontend build location: apps/web/dist/"
echo "🔧 Backend location: server/"
