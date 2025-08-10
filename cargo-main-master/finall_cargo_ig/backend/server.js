const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(limiter);

// CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.CORS_ORIGIN,
      'http://localhost:5173',
      'http://localhost:4173',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:4173'
    ].filter(Boolean);
    
    // Add multiple domains if specified
    if (process.env.CORS_ORIGINS) {
      allowedOrigins.push(...process.env.CORS_ORIGINS.split(','));
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection with graceful fallback
let mongoConnected = false;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cargo-capital', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // 10 second timeout for production
  maxPoolSize: 10, // Maintain up to 10 socket connections
  socketTimeoutMS: 45000 // Close connections after 45 seconds of inactivity
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  console.log(`📊 Database: ${process.env.MONGODB_URI ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB'}`);
  mongoConnected = true;
})
.catch((error) => {
  console.error('❌ MongoDB connection failed:', error.message);
  if (process.env.NODE_ENV === 'production') {
    console.log('🔄 Server will continue running with mock data fallback');
    console.log('⚠️  For production use, ensure MongoDB Atlas IP whitelist includes 0.0.0.0/0');
  } else {
    console.log('🔄 Server will continue running with mock data fallback');
    console.log('📝 To use database features, please install and start MongoDB');
  }
  mongoConnected = false;
});

// Middleware to check MongoDB connection
app.use((req, res, next) => {
  req.mongoConnected = mongoConnected;
  next();
});

// Import models
require('./models/Shipment');

// Import routes
const trackingRoutes = require('./routes/tracking');
const shipmentRoutes = require('./routes/shipments');

// Routes
app.use('/api', trackingRoutes);
app.use('/api', shipmentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Capital Cargo API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Capital Cargo API server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/cargo-capital'}`);
});

module.exports = app;
