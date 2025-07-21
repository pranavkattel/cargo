@echo off
REM 🚀 Cargo Capital - Complete Setup Script for Windows
REM This script sets up the entire Cargo Capital project for buyers

echo 🚢 Welcome to Cargo Capital Setup!
echo ==================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found:
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed.
    echo Please install npm (usually comes with Node.js)
    pause
    exit /b 1
)

echo ✅ npm found:
npm --version
echo.

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed
echo.

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed
cd ..
echo.

REM Create environment files if they don't exist
echo ⚙️ Setting up environment files...

REM Frontend .env
if not exist ".env" (
    echo VITE_API_URL=http://localhost:5000 > .env
    echo ✅ Created frontend .env file
) else (
    echo ℹ️ Frontend .env file already exists
)

REM Backend .env (already exists from previous setup)
if exist "backend\.env" (
    echo ✅ Backend .env file already configured
) else (
    echo ⚠️ Backend .env file not found - this shouldn't happen
)

echo.

REM Test if MongoDB is available (optional)
echo 🗄️ Testing MongoDB connection...
cd backend
node scripts\checkMongoDB.js
echo.
cd ..

echo 🎉 Setup Complete!
echo ==================
echo.
echo ✅ All dependencies installed
echo ✅ Environment files configured
echo ✅ Ready to run!
echo.
echo 🚀 To start the application:
echo.
echo Terminal 1 (Backend):
echo   cd backend
echo   npm start
echo.
echo Terminal 2 (Frontend):
echo   npm run dev
echo.
echo Then visit: http://localhost:5173
echo.
echo 🧪 Test with these tracking IDs:
echo   - CC001TEST (In Transit)
echo   - CC002TEST (Delivered)
echo   - CC003TEST (Out for Delivery)
echo.
echo 🛠️ Admin Panel: http://localhost:5173/admin
echo.
echo 📖 Need help? Check:
echo   - BUYER_QUICK_START.md
echo   - DEPLOYMENT_GUIDE.md
echo   - API_DOCUMENTATION.md
echo.
echo 🎯 Happy shipping! 📦
echo.
pause
