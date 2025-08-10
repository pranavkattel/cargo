#!/bin/bash

# 🚀 Cargo Capital - Complete Setup Script
# This script sets up the entire Cargo Capital project for buyers

echo "🚢 Welcome to Cargo Capital Setup!"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    echo "Please install npm (usually comes with Node.js)"
    exit 1
fi

echo "✅ npm found: $(npm --version)"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
echo "✅ Frontend dependencies installed"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
echo "✅ Backend dependencies installed"
cd ..
echo ""

# Create environment files if they don't exist
echo "⚙️ Setting up environment files..."

# Frontend .env
if [ ! -f ".env" ]; then
    echo "VITE_API_URL=http://localhost:5000" > .env
    echo "✅ Created frontend .env file"
else
    echo "ℹ️ Frontend .env file already exists"
fi

# Backend .env (already exists from previous setup)
if [ -f "backend/.env" ]; then
    echo "✅ Backend .env file already configured"
else
    echo "⚠️ Backend .env file not found - this shouldn't happen"
fi

echo ""

# Test if MongoDB is available (optional)
echo "🗄️ Testing MongoDB connection..."
cd backend
node scripts/checkMongoDB.js
echo ""
cd ..

echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "✅ All dependencies installed"
echo "✅ Environment files configured"
echo "✅ Ready to run!"
echo ""
echo "🚀 To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  npm start"
echo ""
echo "Terminal 2 (Frontend):"
echo "  npm run dev"
echo ""
echo "Then visit: http://localhost:5173"
echo ""
echo "🧪 Test with these tracking IDs:"
echo "  - CC001TEST (In Transit)"
echo "  - CC002TEST (Delivered)"
echo "  - CC003TEST (Out for Delivery)"
echo ""
echo "🛠️ Admin Panel: http://localhost:5173/admin"
echo ""
echo "📖 Need help? Check:"
echo "  - BUYER_QUICK_START.md"
echo "  - DEPLOYMENT_GUIDE.md"
echo "  - API_DOCUMENTATION.md"
echo ""
echo "🎯 Happy shipping! 📦"
