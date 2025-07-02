const mongoose = require('mongoose');
require('dotenv').config();
const Shipment = require('../models/Shipment');

// Sample data
const sampleShipments = [
  {
    trackingId: 'CC001TEST',
    customerInfo: {
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1-555-0123',
      address: '123 Main St, New York, NY 10001'
    },
    shipmentDetails: {
      origin: 'New York, NY',
      destination: 'Los Angeles, CA',
      weight: 5.2,
      dimensions: {
        length: 12,
        width: 8,
        height: 6
      },
      serviceType: 'express',
      description: 'Electronics - Laptop Computer',
      value: 1200
    },
    status: 'in transit',
    events: [
      {
        status: 'processing',
        description: 'Shipment received and processing has begun',
        location: 'New York, NY - Processing Center',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        completed: true
      },
      {
        status: 'in transit',
        description: 'Package has departed origin facility',
        location: 'New York, NY - Distribution Center',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        completed: true
      },
      {
        status: 'in transit',
        description: 'Package in transit to destination city',
        location: 'Chicago, IL - Transit Hub',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        completed: true
      }
    ],
    estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) // Tomorrow
  },
  {
    trackingId: 'CC002TEST',
    customerInfo: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1-555-0456',
      address: '456 Oak Ave, Miami, FL 33101'
    },
    shipmentDetails: {
      origin: 'Miami, FL',
      destination: 'Seattle, WA',
      weight: 2.8,
      dimensions: {
        length: 10,
        width: 10,
        height: 4
      },
      serviceType: 'standard',
      description: 'Books and Documents',
      value: 150
    },
    status: 'delivered',
    events: [
      {
        status: 'processing',
        description: 'Shipment received and processing has begun',
        location: 'Miami, FL - Processing Center',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        completed: true
      },
      {
        status: 'in transit',
        description: 'Package has departed origin facility',
        location: 'Miami, FL - Distribution Center',
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
        completed: true
      },
      {
        status: 'in transit',
        description: 'Package in transit to destination city',
        location: 'Atlanta, GA - Transit Hub',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        completed: true
      },
      {
        status: 'out for delivery',
        description: 'Package out for delivery',
        location: 'Seattle, WA - Local Facility',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        completed: true
      },
      {
        status: 'delivered',
        description: 'Package delivered successfully',
        location: 'Seattle, WA - 456 Oak Ave',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        completed: true
      }
    ],
    estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
    actualDelivery: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
  },
  {
    trackingId: 'CC003TEST',
    customerInfo: {
      name: 'Michael Brown',
      email: 'michael.brown@email.com',
      phone: '+1-555-0789',
      address: '789 Pine St, Denver, CO 80202'
    },
    shipmentDetails: {
      origin: 'Denver, CO',
      destination: 'Boston, MA',
      weight: 15.5,
      dimensions: {
        length: 18,
        width: 12,
        height: 10
      },
      serviceType: 'overnight',
      description: 'Medical Equipment',
      value: 3500
    },
    status: 'out for delivery',
    events: [
      {
        status: 'processing',
        description: 'Shipment received and processing has begun',
        location: 'Denver, CO - Processing Center',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        completed: true
      },
      {
        status: 'in transit',
        description: 'Package has departed origin facility',
        location: 'Denver, CO - Distribution Center',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        completed: true
      },
      {
        status: 'in transit',
        description: 'Package arrived at destination facility',
        location: 'Boston, MA - Distribution Center',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        completed: true
      },
      {
        status: 'out for delivery',
        description: 'Package out for delivery',
        location: 'Boston, MA - Local Facility',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        completed: false
      }
    ],
    estimatedDelivery: new Date(Date.now() + 6 * 60 * 60 * 1000) // In 6 hours
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cargo-capital', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await Shipment.deleteMany({});
    console.log('Cleared existing shipments');

    // Insert sample data
    const createdShipments = await Shipment.insertMany(sampleShipments);
    console.log(`Created ${createdShipments.length} sample shipments:`);
    
    createdShipments.forEach(shipment => {
      console.log(`- ${shipment.trackingId}: ${shipment.status} (${shipment.customerInfo.name})`);
    });

    console.log('\\nDatabase seeded successfully!');
    console.log('\\nYou can test tracking with these IDs:');
    console.log('- CC001TEST (in transit)');
    console.log('- CC002TEST (delivered)');  
    console.log('- CC003TEST (out for delivery)');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\\nDatabase connection closed');
  }
}

// Run the seed script
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleShipments };
