#!/usr/bin/env node

require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  console.log('🔗 Testing MongoDB Connection...');
  console.log('================================\n');

  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.log('❌ MONGODB_URI not found in environment variables');
    console.log('💡 Make sure you have a .env file with MONGODB_URI set');
    process.exit(1);
  }

  if (mongoUri.includes('username:password')) {
    console.log('❌ MONGODB_URI contains placeholder values');
    console.log('💡 Please update your .env file with actual credentials');
    process.exit(1);
  }

  try {
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000
    });

    console.log('✅ Successfully connected to MongoDB!');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
    
    // Test basic operations
    console.log('\n🧪 Testing database operations...');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📋 Collections found: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('📁 Collection names:');
      collections.forEach(col => console.log(`   - ${col.name}`));
    }

    // Check if shipments collection exists
    const shipmentsCollection = collections.find(col => col.name === 'shipments');
    if (shipmentsCollection) {
      const count = await mongoose.connection.db.collection('shipments').countDocuments();
      console.log(`📦 Shipments in database: ${count}`);
    } else {
      console.log('📦 Shipments collection will be created when first shipment is added');
    }

    console.log('\n🎉 MongoDB is ready for Cargo Capital!');
    console.log('🚀 You can now start the server with: npm start');

  } catch (error) {
    console.log('❌ Failed to connect to MongoDB');
    console.log(`🔍 Error: ${error.message}`);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Check your internet connection');
    console.log('   2. Verify your MongoDB credentials');
    console.log('   3. Ensure your IP is whitelisted in MongoDB Atlas');
    console.log('   4. Check if the database name is correct');
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

testConnection();
