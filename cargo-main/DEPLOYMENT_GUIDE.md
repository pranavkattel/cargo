# 🚀 Cargo Capital - Complete Deployment Guide

## Overview
Cargo Capital is a modern, full-stack cargo tracking system built with:
- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **Features**: Real-time tracking, Admin panel, Mock data fallback

## 📋 Prerequisites

### For Development/Testing
- Node.js 18+ ([Download](https://nodejs.org/))
- Git ([Download](https://git-scm.com/))

### For Production Database (Optional)
- MongoDB Atlas account ([Sign up free](https://www.mongodb.com/atlas))
- OR Local MongoDB installation

## 🏃‍♂️ Quick Start (Local Development)

### 1. Clone and Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd cargo

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Environment Configuration
The app works out-of-the-box with mock data. For database features:

```bash
# Copy environment template
cp backend/.env.example backend/.env

# Edit backend/.env and update:
MONGODB_URI=your_mongodb_connection_string
```

### 3. Start Development Servers
```bash
# Terminal 1: Start backend (from project root)
cd backend
npm start

# Terminal 2: Start frontend (from project root)
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Test Tracking**: Use IDs like `CC001TEST`, `CC002TEST`, `CC003TEST`

## 🗄️ Database Setup

### Option A: MongoDB Atlas (Recommended for Production)

1. **Create Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for free tier

2. **Create Cluster**
   - Choose free tier (M0)
   - Select region closest to your users
   - Create cluster (takes 3-5 minutes)

3. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password

4. **Update Environment**
   ```env
   # In backend/.env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cargo-capital?retryWrites=true&w=majority
   ```

5. **Seed Database**
   ```bash
   cd backend
   node scripts/seedData.js
   ```

### Option B: Local MongoDB

1. **Install MongoDB**
   - [Windows](https://www.mongodb.com/try/download/community)
   - [macOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)
   - [Linux](https://docs.mongodb.com/manual/administration/install-on-linux/)

2. **Start MongoDB**
   ```bash
   # Windows (if installed as service)
   net start MongoDB

   # macOS/Linux
   mongod
   ```

3. **Seed Database**
   ```bash
   cd backend
   node scripts/seedData.js
   ```

## 🌐 Production Deployment

### Frontend Deployment (Vercel/Netlify)

#### Option 1: Vercel
1. **Build Project**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy
   vercel --prod
   ```

3. **Environment Variables**
   - Set `VITE_API_URL` to your backend URL

#### Option 2: Netlify
1. **Build Project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag `dist/` folder to [Netlify Drop](https://app.netlify.com/drop)
   - Or connect GitHub repository

### Backend Deployment (Railway/Render/Heroku)

#### Option 1: Railway
1. **Connect Repository**
   - Go to [Railway](https://railway.app)
   - Connect GitHub repository
   - Select backend folder

2. **Environment Variables**
   ```env
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_atlas_connection_string
   CORS_ORIGIN=https://your-frontend-domain.com
   ```

3. **Deploy**
   - Railway auto-deploys on git push

#### Option 2: Render
1. **Create Web Service**
   - Go to [Render](https://render.com)
   - Connect repository
   - Set build command: `cd backend && npm install`
   - Set start command: `cd backend && npm start`

2. **Environment Variables** (same as Railway)

### Database Deployment
- **MongoDB Atlas**: Already cloud-hosted
- **Local MongoDB**: Not recommended for production

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
# For production: VITE_API_URL=https://your-backend-domain.com
```

#### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/cargo-capital
CORS_ORIGIN=https://your-frontend-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
DB_NAME=cargo-capital
```

## 🎯 Testing

### Test with Mock Data
The app works immediately with built-in test tracking numbers:
- `CC001TEST` - In Transit
- `CC002TEST` - Delivered  
- `CC003TEST` - Out for Delivery

### Test with Database
1. Ensure MongoDB is connected
2. Run: `cd backend && node scripts/seedData.js`
3. Use the same test tracking numbers

### Admin Panel
- Access: `/admin` (linked in navigation)
- View all shipments
- Add new shipments
- Edit existing shipments

## 🚨 Troubleshooting

### Common Issues

#### White Screen/Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### Database Connection Failed
- Check MONGODB_URI format
- Verify network access in Atlas
- Ensure firewall allows connections

#### CORS Errors
- Update CORS_ORIGIN in backend/.env
- Ensure frontend URL matches exactly

#### Port Conflicts
```bash
# Change ports in scripts
"dev": "vite --port 3000"  # Frontend
PORT=3001  # Backend .env
```

## 📈 Performance Optimization

### Frontend
```bash
# Analyze bundle
npm run build
npm run preview
```

### Backend
- Enable compression: `app.use(compression())`
- Use PM2 for process management
- Implement caching with Redis

## 🔒 Security

### Production Checklist
- [ ] Update default admin credentials
- [ ] Set strong JWT secrets
- [ ] Enable HTTPS only
- [ ] Configure rate limiting
- [ ] Set proper CORS origins
- [ ] Update MongoDB Atlas IP whitelist
- [ ] Enable database authentication

## 📞 Support

### For Buyers/End Users
- Check this guide first
- Verify environment variables
- Test with mock data before database setup
- Check browser console for errors

### For Developers
- All source code is documented
- Follow React/Node.js best practices
- Database schema in `backend/models/`
- API endpoints in `backend/routes/`

## 🎉 Success!

Your Cargo Capital tracking system should now be:
- ✅ Running locally for development
- ✅ Connected to database (optional)
- ✅ Ready for production deployment
- ✅ Accessible to end users

Visit your deployed frontend URL and test tracking with the provided test IDs!
