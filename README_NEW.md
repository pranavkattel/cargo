# 🚢 Cargo Capital - Professional Cargo Tracking System

A modern, full-stack cargo tracking solution built with React, Node.js, and MongoDB. Perfect for logistics companies, shipping businesses, and freight forwarders.

![Cargo Capital](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18+-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20Ready-yellow)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)

## ✨ Features

### 🎯 Customer Features
- **Real-time Tracking**: Track shipments with detailed status updates
- **Interactive Timeline**: Visual progress tracking with timestamps
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Professional UI**: Modern, clean interface using Tailwind CSS

### 🔧 Admin Features
- **Complete Dashboard**: View all shipments at a glance
- **CRUD Operations**: Create, Read, Update, Delete shipments
- **Customer Management**: Store and manage customer information
- **Status Updates**: Real-time status management
- **Mock Data Support**: Works immediately without database setup

### 🛠️ Technical Features
- **Modern Stack**: React + TypeScript + Vite + Node.js + Express + MongoDB
- **Cloud Ready**: Deploy to Vercel, Netlify, Railway, Render
- **Database Flexible**: Works with MongoDB Atlas or local MongoDB
- **API Secure**: Rate limiting, CORS protection, helmet security
- **SEO Optimized**: Proper meta tags and structure

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- Git ([Download](https://git-scm.com/))

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd cargo-capital

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Development
```bash
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Start frontend
npm run dev
```

### Access
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:5173/admin

### Test Tracking
Try these demo tracking IDs:
- `CC001TEST` - In Transit
- `CC002TEST` - Delivered
- `CC003TEST` - Out for Delivery

## 📁 Project Structure

```
cargo-capital/
├── src/                          # Frontend source code
│   ├── components/               # Reusable React components
│   │   ├── Navbar.tsx           # Navigation component
│   │   ├── Footer.tsx           # Footer component
│   │   ├── Globe3D.tsx          # 3D globe visualization
│   │   └── ...
│   ├── pages/                   # Page components
│   │   ├── Home.tsx             # Landing page
│   │   ├── Tracking.tsx         # Tracking page
│   │   ├── AdminTracking.tsx    # Admin dashboard
│   │   └── ...
│   ├── services/                # API services
│   │   └── trackingService.ts   # API calls and mock data
│   └── assets/                  # Static assets
│
├── backend/                     # Backend source code
│   ├── models/                  # Database models
│   │   └── Shipment.js         # Shipment schema
│   ├── routes/                  # API routes
│   │   ├── tracking.js         # Tracking endpoints
│   │   └── shipments.js        # Admin endpoints
│   ├── scripts/                # Utility scripts
│   │   ├── seedData.js         # Database seeding
│   │   └── checkMongoDB.js     # Connection testing
│   ├── server.js               # Express server
│   └── .env                    # Environment variables
│
├── DEPLOYMENT_GUIDE.md         # Complete deployment instructions
├── API_DOCUMENTATION.md        # API endpoint documentation
├── BUYER_QUICK_START.md        # Quick start for buyers
└── SALES_PACKAGE.md            # Sales information
```

## 🗄️ Database Setup

### Option 1: MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://mongodb.com/atlas)
2. Create free cluster (M0)
3. Get connection string
4. Update `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cargo-capital
   ```
5. Seed database:
   ```bash
   cd backend
   node scripts/seedData.js
   ```

### Option 2: Local MongoDB
1. Install MongoDB Community Server
2. Start MongoDB service
3. Use default connection: `mongodb://localhost:27017/cargo-capital`

**Note**: App works with mock data even without database!

## 🌐 Deployment

### Frontend (Vercel/Netlify)
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
# Drag 'dist' folder to netlify.com/drop
```

### Backend (Railway/Render)
```bash
# Deploy to Railway
railway create cargo-backend
railway up

# Set environment variables in platform dashboard
```

### Environment Variables
**Frontend (.env):**
```env
VITE_API_URL=https://your-backend-url.com
```

**Backend (.env):**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=https://your-frontend-url.com
```

## 🔌 API Endpoints

### Public
- `GET /api/track/:trackingId` - Track shipment
- `GET /api/health` - Health check

### Admin
- `GET /api/admin/shipments` - Get all shipments
- `POST /api/admin/shipments` - Create shipment
- `PUT /api/admin/shipments/:id` - Update shipment
- `DELETE /api/admin/shipments/:id` - Delete shipment

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete details.

## 🎨 Customization

### Branding
```typescript
// src/components/Navbar.tsx
const companyName = "Your Company Name";

// Update logo: src/assets/images/logo.jpg
```

### Styling
```typescript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: '#your-primary-color',
      secondary: '#your-secondary-color'
    }
  }
}
```

### Mock Data
```typescript
// src/services/trackingService.ts
// Customize demo tracking data
```

## 🧪 Testing

### Manual Testing
```bash
# Test with demo data
# Visit: http://localhost:5173
# Try tracking: CC001TEST, CC002TEST, CC003TEST

# Test admin panel
# Visit: http://localhost:5173/admin
```

### API Testing
```bash
# Test tracking endpoint
curl http://localhost:5000/api/track/CC001TEST

# Test health endpoint
curl http://localhost:5000/api/health
```

## 📚 Documentation

- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Complete setup instructions
- **[API Documentation](./API_DOCUMENTATION.md)** - Backend API reference
- **[Buyer Quick Start](./BUYER_QUICK_START.md)** - Quick start for purchasers
- **[Sales Package](./SALES_PACKAGE.md)** - Product information

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **CORS** protection
- **Helmet** security
- **Rate limiting**
- **Morgan** logging

### Deployment
- **Frontend**: Vercel, Netlify, AWS S3
- **Backend**: Railway, Render, Heroku
- **Database**: MongoDB Atlas, AWS DocumentDB

## 🤝 Support

### For Buyers
- ✅ 30 days email support included
- ✅ Setup and deployment assistance
- ✅ Basic customization guidance
- ✅ Bug fixes and updates

### For Developers
- 📖 Comprehensive documentation
- 🔧 Well-structured, maintainable code
- 🚀 Modern development practices
- 📱 Mobile-first responsive design

## 📄 License

This project is licensed for commercial use. See purchase terms for details.

## 🎯 Perfect For

- **Logistics Companies**: Small to medium freight forwarders
- **Shipping Businesses**: Local/regional shipping services  
- **E-commerce**: Businesses needing customer tracking
- **Developers**: Modern full-stack learning project
- **Startups**: MVP tracking solution

---

## 🚀 Ready to Deploy?

1. **Development**: Follow Quick Start above
2. **Production**: Check [Deployment Guide](./DEPLOYMENT_GUIDE.md)
3. **Customization**: Modify branding and styling
4. **Support**: Contact us during your support period

**Questions?** Check our comprehensive documentation or reach out for support!

*Professional cargo tracking - delivered ready to deploy! 📦🚀*
