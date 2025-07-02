const mongoose = require('mongoose');

const TrackingEventSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { _id: true });

const CustomerInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

const DimensionsSchema = new mongoose.Schema({
  length: {
    type: Number,
    required: true,
    min: 0
  },
  width: {
    type: Number,
    required: true,
    min: 0
  },
  height: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const ShipmentDetailsSchema = new mongoose.Schema({
  origin: {
    type: String,
    required: true,
    trim: true
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  weight: {
    type: Number,
    required: true,
    min: 0
  },
  dimensions: {
    type: DimensionsSchema,
    required: false
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['standard', 'express', 'overnight', 'international'],
    default: 'standard'
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  value: {
    type: Number,
    min: 0,
    default: 0
  }
}, { _id: false });

const ShipmentSchema = new mongoose.Schema({
  trackingId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  customerInfo: {
    type: CustomerInfoSchema,
    required: true
  },
  shipmentDetails: {
    type: ShipmentDetailsSchema,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['processing', 'in transit', 'out for delivery', 'delivered', 'exception'],
    default: 'processing'
  },
  events: [TrackingEventSchema],
  estimatedDelivery: {
    type: Date,
    required: true
  },
  actualDelivery: {
    type: Date,
    required: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster tracking ID lookups
ShipmentSchema.index({ trackingId: 1 });
ShipmentSchema.index({ status: 1 });
ShipmentSchema.index({ createdAt: -1 });

// Virtual for tracking URL
ShipmentSchema.virtual('trackingUrl').get(function() {
  return `${process.env.FRONTEND_URL || 'http://localhost:5173'}/tracking?id=${this.trackingId}`;
});

// Method to add tracking event
ShipmentSchema.methods.addTrackingEvent = function(status, description, location) {
  this.events.push({
    status,
    description,
    location,
    timestamp: new Date(),
    completed: ['delivered', 'exception'].includes(status)
  });
  
  this.status = status;
  
  if (status === 'delivered' && !this.actualDelivery) {
    this.actualDelivery = new Date();
  }
  
  return this.save();
};

// Method to generate tracking ID
ShipmentSchema.statics.generateTrackingId = function() {
  const prefix = 'CC'; // Capital Cargo
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

// Pre-save middleware to generate tracking ID if not provided
ShipmentSchema.pre('save', function(next) {
  if (!this.trackingId) {
    this.trackingId = this.constructor.generateTrackingId();
  }
  next();
});

module.exports = mongoose.model('Shipment', ShipmentSchema);
