const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { storageAdapter } = require('./data/storageConfig');
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
    
    // In development, allow any origin from the same network for convenience
    if (process.env.NODE_ENV !== 'production') {
      // Allow any localhost/127.0.0.1 with any port
      if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('192.168.') || origin.includes('10.0.') || origin.includes('172.'))) {
        return callback(null, true);
      }
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

// Initialize storage system
async function initializeApp() {
  await storageAdapter.init();
  console.log('✅ Storage system initialized');
  
  // Get storage stats
  try {
    const stats = await storageAdapter.getStats();
    console.log('📊 Storage stats:', stats);
  } catch (error) {
    console.log('📊 Storage stats not available');
  }
}

// Middleware to pass storage helpers to routes
app.use((req, res, next) => {
  req.storage = storageAdapter.getHelpers();
  next();
});

// Import routes
const trackingRoutes = require('./routes/tracking');
const shipmentRoutes = require('./routes/shipments');
const adminRoutes = require('./routes/admin');
const emailRoutes = require('./routes/email');

// Routes
app.use('/api', trackingRoutes);
app.use('/api', shipmentRoutes);
app.use('/api', adminRoutes);
app.use('/api', emailRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Capital Cargo API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Storage stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await storageAdapter.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get storage stats',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
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

// Start server with storage initialization
async function startServer() {
  try {
    await initializeApp();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Capital Cargo API server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Storage Type: ${process.env.STORAGE_TYPE || 'file'}`);
      console.log(`🌐 Network access enabled - accessible from other devices`);
      console.log(`📱 Local access: http://localhost:${PORT}`);
      console.log(`🔗 Network access: http://[YOUR_IP]:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
