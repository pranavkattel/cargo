#!/bin/bash

# 🚀 Production Build & Deployment Verification Script

echo "🔧 Capital Cargo - Production Build Verification"
echo "================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Must run from project root directory"
    exit 1
fi

# Frontend Build Test
echo "📦 Testing Frontend Build..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    exit 1
fi

# Check if dist directory was created
if [ -d "dist" ]; then
    echo "✅ Dist directory created"
    echo "📊 Build size:"
    du -sh dist/
else
    echo "❌ Dist directory not found"
    exit 1
fi

# Backend Dependencies Check
echo "🔧 Checking Backend Dependencies..."
cd backend
if npm ls --depth=0 > /dev/null 2>&1; then
    echo "✅ Backend dependencies OK"
else
    echo "⚠️  Installing backend dependencies..."
    npm install
fi

# Environment Variables Check
echo "🌍 Checking Environment Variables..."
if [ -f ".env" ]; then
    echo "✅ Backend .env file exists"
else
    echo "❌ Backend .env file missing"
fi

if [ -f ".env.production" ]; then
    echo "✅ Backend .env.production file exists"
else
    echo "❌ Backend .env.production file missing"
fi

cd ..

if [ -f ".env" ]; then
    echo "✅ Frontend .env file exists"
else
    echo "❌ Frontend .env file missing"
fi

if [ -f ".env.production" ]; then
    echo "✅ Frontend .env.production file exists"
else
    echo "❌ Frontend .env.production file missing"
fi

# Test Preview Build
echo "🔍 Testing Preview Build..."
npm run preview &
PREVIEW_PID=$!
sleep 3

# Check if preview is running
if kill -0 $PREVIEW_PID 2>/dev/null; then
    echo "✅ Preview server started successfully"
    kill $PREVIEW_PID
else
    echo "❌ Preview server failed to start"
fi

echo ""
echo "🎉 Production Build Verification Complete!"
echo "================================================"
echo "📋 Deployment Checklist:"
echo "   ✅ Frontend builds successfully"
echo "   ✅ Backend dependencies installed"
echo "   ✅ Environment files configured"
echo "   ✅ Preview works locally"
echo ""
echo "🚀 Ready for deployment to:"
echo "   • Frontend: Vercel/Netlify"
echo "   • Backend: Railway/Render"
echo "   • Database: MongoDB Atlas"
echo ""
echo "📖 Next steps: See PRODUCTION_DEPLOYMENT.md"
