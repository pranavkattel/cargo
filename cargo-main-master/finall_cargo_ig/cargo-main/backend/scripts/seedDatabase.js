const mongoose = require('mongoose');
require('dotenv').config();

// Import your Shipment model (adjust path if needed)
const Shipment = require('../models/Shipment');

// Sample shipments data
const sampleShipments = [
  {
    trackingId: 'CC001234',
    customerInfo: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+977-9812345678',
      address: 'Kathmandu, Nepal'
    },
    shipmentDetails: {
      origin: 'Kathmandu, Nepal',
      destination: 'New York, USA',
      weight: 2.5,
      serviceType: 'Air Cargo Express',
      description: 'Documents and handicrafts',
      value: 150
    },
    status: 'In Transit',
    events: [
      {
        status: 'Package Collected',
        description: 'Package collected from sender',
        location: 'Kathmandu, Nepal',
        timestamp: new Date('2024-01-20T14:30:00Z'),
        completed: true
      },
      {
        status: 'Customs Cleared',
        description: 'Package cleared customs and ready for export',
        location: 'Kathmandu Airport, Nepal',
        timestamp: new Date('2024-01-21T08:45:00Z'),
        completed: true
      },
      {
        status: 'In Transit',
        description: 'Package arrived at transit hub',
        location: 'Dubai, UAE',
        timestamp: new Date('2024-01-21T22:15:00Z'),
        completed: true
      },
      {
        status: 'Out for Delivery',
        description: 'Package out for final delivery',
        location: 'New York, USA',
        timestamp: new Date('2024-01-25T10:00:00Z'),
        completed: false
      }
    ],
    estimatedDelivery: new Date('2024-01-25T18:00:00Z'),
    createdAt: new Date('2024-01-20T10:00:00Z'),
    updatedAt: new Date('2024-01-21T22:15:00Z')
  },
  {
    trackingId: 'CC005678',
    customerInfo: {
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '+44-7123456789',
      address: 'London, UK'
    },
    shipmentDetails: {
      origin: 'Kathmandu, Nepal',
      destination: 'London, UK',
      weight: 5.2,
      serviceType: 'Sea Freight',
      description: 'Traditional carpets',
      value: 800
    },
    status: 'Delivered',
    events: [
      {
        status: 'Package Collected',
        description: 'Package collected from sender',
        location: 'Kathmandu, Nepal',
        timestamp: new Date('2024-01-10T09:00:00Z'),
        completed: true
      },
      {
        status: 'Shipped',
        description: 'Package loaded onto cargo vessel',
        location: 'Kolkata Port, India',
        timestamp: new Date('2024-01-15T16:30:00Z'),
        completed: true
      },
      {
        status: 'In Transit',
        description: 'Package in transit via sea route',
        location: 'Arabian Sea',
        timestamp: new Date('2024-01-20T12:00:00Z'),
        completed: true
      },
      {
        status: 'Delivered',
        description: 'Package successfully delivered',
        location: 'London, UK',
        timestamp: new Date('2024-02-01T14:20:00Z'),
        completed: true
      }
    ],
    estimatedDelivery: new Date('2024-02-01T18:00:00Z'),
    actualDelivery: new Date('2024-02-01T14:20:00Z'),
    createdAt: new Date('2024-01-10T09:00:00Z'),
    updatedAt: new Date('2024-02-01T14:20:00Z')
  },
  {
    trackingId: 'DEMO123',
    customerInfo: {
      name: 'Demo User',
      email: 'demo@example.com',
      phone: '+1-555-0000',
      address: 'Demo City, USA'
    },
    shipmentDetails: {
      origin: 'New York, USA',
      destination: 'Kathmandu, Nepal',
      weight: 10,
      serviceType: 'Express',
      description: 'Demo Electronics',
      value: 500
    },
    status: 'In Transit',
    events: [
      {
        status: 'Shipped',
        description: 'Shipment picked up from sender.',
        location: 'New York, USA',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        completed: true
      },
      {
        status: 'In Transit',
        description: 'Shipment is on the way.',
        location: 'Dubai, UAE',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        completed: false
      }
    ],
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    trackingId: 'TEST456',
    customerInfo: {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+1-555-1111',
      address: 'Test City, USA'
    },
    shipmentDetails: {
      origin: 'Los Angeles, USA',
      destination: 'London, UK',
      weight: 5,
      serviceType: 'Standard',
      description: 'Test Books',
      value: 200
    },
    status: 'Delivered',
    events: [
      {
        status: 'Shipped',
        description: 'Shipment picked up from sender.',
        location: 'Los Angeles, USA',
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        completed: true
      },
      {
        status: 'Delivered',
        description: 'Shipment delivered to recipient.',
        location: 'London, UK',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        completed: true
      }
    ],
    estimatedDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing shipments
    await Shipment.deleteMany({});
    console.log('Cleared existing shipments');

    // Insert sample shipments
    const result = await Shipment.insertMany(sampleShipments);
    console.log(`Inserted ${result.length} sample shipments`);

    console.log('Sample tracking IDs:');
    result.forEach(shipment => {
      console.log(`- ${shipment.trackingId} (${shipment.status})`);
    });

    console.log('\nDatabase seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
