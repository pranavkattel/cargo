const mongoose = require('mongoose');

// Import Admin model for initialization
const Admin = require('../models/Admin');

// Import the correct Shipment model (instead of defining a duplicate)
const Shipment = require('../models/Shipment');

// MongoDB storage helpers
const mongoStorageHelpers = {
  // Initialize MongoDB connection
  init: async (connectionString) => {
    try {
      await mongoose.connect(connectionString, {
        serverSelectionTimeoutMS: 10000,
        maxPoolSize: 10,
        socketTimeoutMS: 45000
      });
      
      console.log('✅ Connected to MongoDB');
      console.log(`📊 Database: ${connectionString.includes('mongodb.net') ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB'}`);
      
      // Create initial data if collection is empty
      const count = await Shipment.countDocuments();
      if (count === 0) {
        console.log('📋 No existing data found, creating sample shipments...');
        await createSampleData();
      } else {
        console.log(`📦 Found ${count} existing shipments in database`);
      }

      // Initialize default admin user
      try {
        await Admin.createDefaultAdmin();
      } catch (error) {
        console.error('⚠️  Warning: Could not initialize admin user:', error.message);
      }
      
      return true;
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
      throw error;
    }
  },

  // Find shipment by tracking ID
  findByTrackingId: async (trackingId) => {
    try {
      const shipment = await Shipment.findOne({ 
        trackingId: trackingId.toUpperCase() 
      }).lean();
      
      if (shipment) {
        // Transform MongoDB document to match API format
        return {
          id: shipment._id.toString(),
          trackingId: shipment.trackingId,
          status: shipment.status,
          customerInfo: shipment.customerInfo,
          shipmentDetails: shipment.shipmentDetails,
          trackingEvents: shipment.trackingEvents,
          createdAt: shipment.createdAt,
          updatedAt: shipment.updatedAt
        };
      }
      return null;
    } catch (error) {
      console.error('Error finding shipment by tracking ID:', error);
      throw error;
    }
  },

  // Find multiple shipments by tracking IDs
  findByTrackingIds: async (trackingIds) => {
    try {
      const upperIds = trackingIds.map(id => id.toUpperCase());
      const shipments = await Shipment.find({ 
        trackingId: { $in: upperIds }
      }).lean();
      
      return shipments.map(shipment => ({
        id: shipment._id.toString(),
        trackingId: shipment.trackingId,
        status: shipment.status,
        customerInfo: shipment.customerInfo,
        shipmentDetails: shipment.shipmentDetails,
        trackingEvents: shipment.trackingEvents,
        createdAt: shipment.createdAt,
        updatedAt: shipment.updatedAt
      }));
    } catch (error) {
      console.error('Error finding shipments by tracking IDs:', error);
      throw error;
    }
  },

  // Get all shipments with pagination and filtering
  getAllShipments: async (options = {}) => {
    try {
      const { page = 1, limit = 10, status, search } = options;
      const skip = (page - 1) * limit;

      // Build query
      let query = {};
      if (status) {
        query.status = status;
      }
      if (search) {
        query.$or = [
          { trackingId: { $regex: search, $options: 'i' } },
          { 'customerInfo.name': { $regex: search, $options: 'i' } },
          { 'customerInfo.email': { $regex: search, $options: 'i' } }
        ];
      }

      const [shipments, total] = await Promise.all([
        Shipment.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Shipment.countDocuments(query)
      ]);

      const transformedShipments = shipments.map(shipment => ({
        id: shipment._id.toString(),
        trackingId: shipment.trackingId,
        status: shipment.status,
        customerInfo: shipment.customerInfo,
        shipmentDetails: shipment.shipmentDetails,
        trackingEvents: shipment.trackingEvents,
        createdAt: shipment.createdAt,
        updatedAt: shipment.updatedAt
      }));

      return {
        data: transformedShipments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error getting all shipments:', error);
      throw error;
    }
  },

  // Add a new shipment
  addShipment: async (shipmentData) => {
    try {
      const newShipment = new Shipment({
        trackingId: shipmentData.trackingId || `CC${Date.now()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
        status: shipmentData.status || 'processing', // Use lowercase format
        customerInfo: shipmentData.customerInfo,
        shipmentDetails: shipmentData.shipmentDetails,
        events: shipmentData.events || [],
        estimatedDelivery: shipmentData.estimatedDelivery || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
      });

      const savedShipment = await newShipment.save();
      
      return {
        id: savedShipment._id.toString(),
        trackingId: savedShipment.trackingId,
        status: savedShipment.status,
        customerInfo: savedShipment.customerInfo,
        shipmentDetails: savedShipment.shipmentDetails,
        events: savedShipment.events,
        estimatedDelivery: savedShipment.estimatedDelivery,
        createdAt: savedShipment.createdAt,
        updatedAt: savedShipment.updatedAt
      };
    } catch (error) {
      console.error('Error adding shipment:', error);
      throw error;
    }
  },

  // Update shipment
  updateShipment: async (trackingId, updateData) => {
    try {
      const updatedShipment = await Shipment.findOneAndUpdate(
        { trackingId: trackingId.toUpperCase() },
        updateData,
        { new: true, runValidators: true }
      ).lean();

      if (!updatedShipment) return null;

      return {
        id: updatedShipment._id.toString(),
        trackingId: updatedShipment.trackingId,
        status: updatedShipment.status,
        customerInfo: updatedShipment.customerInfo,
        shipmentDetails: updatedShipment.shipmentDetails,
        trackingEvents: updatedShipment.trackingEvents,
        createdAt: updatedShipment.createdAt,
        updatedAt: updatedShipment.updatedAt
      };
    } catch (error) {
      console.error('Error updating shipment:', error);
      throw error;
    }
  },

  // Delete shipment
  deleteShipment: async (trackingId) => {
    try {
      const result = await Shipment.findOneAndDelete({ 
        trackingId: trackingId.toUpperCase() 
      });
      return !!result;
    } catch (error) {
      console.error('Error deleting shipment:', error);
      throw error;
    }
  },

  // Get storage statistics
  getStats: async () => {
    try {
      const total = await Shipment.countDocuments();
      const statusStats = await Shipment.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);
      
      return {
        totalShipments: total,
        database: 'MongoDB',
        connection: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        statusBreakdown: statusStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      throw error;
    }
  }
};

// Create sample data for new database
async function createSampleData() {
  const sampleShipments = [
    {
      trackingId: 'CC001234567',
      status: 'In Transit',
      customerInfo: {
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1-555-0123',
        address: '123 Main St, New York, NY 10001'
      },
      shipmentDetails: {
        origin: 'New York, USA',
        destination: 'London, UK',
        weight: '25kg',
        dimensions: '50x40x30cm',
        service: 'Express International',
        estimatedDelivery: new Date('2025-07-20T10:00:00Z')
      },
      trackingEvents: [
        {
          id: 'evt1',
          status: 'Package Picked Up',
          description: 'Package has been picked up from sender',
          location: 'New York Distribution Center',
          timestamp: new Date('2025-07-14T09:00:00Z'),
          completed: true
        },
        {
          id: 'evt2',
          status: 'In Transit',
          description: 'Package is on its way to destination',
          location: 'JFK International Airport',
          timestamp: new Date('2025-07-15T14:30:00Z'),
          completed: true
        }
      ]
    },
    {
      trackingId: 'CC001234568',
      status: 'Delivered',
      customerInfo: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+44-20-7123-4567',
        address: '456 Oxford Street, London, UK W1C 1AP'
      },
      shipmentDetails: {
        origin: 'Los Angeles, USA',
        destination: 'Sydney, Australia',
        weight: '15kg',
        dimensions: '40x30x25cm',
        service: 'Standard International',
        estimatedDelivery: new Date('2025-07-10T16:00:00Z')
      },
      trackingEvents: [
        {
          id: 'evt6',
          status: 'Package Picked Up',
          description: 'Package has been picked up from sender',
          location: 'Los Angeles Distribution Center',
          timestamp: new Date('2025-07-05T10:00:00Z'),
          completed: true
        },
        {
          id: 'evt10',
          status: 'Delivered',
          description: 'Package delivered successfully',
          location: 'Sydney, Australia',
          timestamp: new Date('2025-07-10T16:00:00Z'),
          completed: true
        }
      ]
    }
  ];

  try {
    await Shipment.insertMany(sampleShipments);
    console.log('✅ Created sample shipments in MongoDB');
  } catch (error) {
    console.error('Error creating sample data:', error);
  }
}

module.exports = {
  mongoStorageHelpers,
  Shipment
};
