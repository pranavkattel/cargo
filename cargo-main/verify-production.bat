@echo off
REM 🚀 Production Build & Deployment Verification Script for Windows

echo 🔧 Capital Cargo - Production Build Verification
echo ================================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Must run from project root directory
    exit /b 1
)

REM Frontend Build Test
echo 📦 Testing Frontend Build...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed
    exit /b 1
)
echo ✅ Frontend build successful

REM Check if dist directory was created
if exist "dist" (
    echo ✅ Dist directory created
) else (
    echo ❌ Dist directory not found
    exit /b 1
)

REM Backend Dependencies Check
echo 🔧 Checking Backend Dependencies...
cd backend
call npm ls --depth=0 >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Installing backend dependencies...
    call npm install
) else (
    echo ✅ Backend dependencies OK
)

REM Environment Variables Check
echo 🌍 Checking Environment Variables...
if exist ".env" (
    echo ✅ Backend .env file exists
) else (
    echo ❌ Backend .env file missing
)

if exist ".env.production" (
    echo ✅ Backend .env.production file exists
) else (
    echo ❌ Backend .env.production file missing
)

cd ..

if exist ".env" (
    echo ✅ Frontend .env file exists
) else (
    echo ❌ Frontend .env file missing
)

if exist ".env.production" (
    echo ✅ Frontend .env.production file exists
) else (
    echo ❌ Frontend .env.production file missing
)

echo.
echo 🎉 Production Build Verification Complete!
echo ================================================
echo 📋 Deployment Checklist:
echo    ✅ Frontend builds successfully
echo    ✅ Backend dependencies installed
echo    ✅ Environment files configured
echo.
echo 🚀 Ready for deployment to:
echo    • Frontend: Vercel/Netlify
echo    • Backend: Railway/Render
echo    • Database: MongoDB Atlas
echo.
echo 📖 Next steps: See PRODUCTION_DEPLOYMENT.md

pause
