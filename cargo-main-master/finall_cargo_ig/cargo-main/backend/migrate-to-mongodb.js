#!/usr/bin/env node

require('dotenv').config();
const fs = require('path');
const { mongoStorageHelpers } = require('./data/mongoStorage');
const { fileStorageHelpers } = require('./data/fileStorage');

async function migrateData() {
  console.log('📦 Cargo Capital - Data Migration Tool');
  console.log('======================================\n');

  try {
    // Check if file storage data exists
    const dataDir = fs.join(__dirname, 'data', 'storage');
    const shipmentsFile = fs.join(dataDir, 'shipments.json');
    
    if (!require('fs').existsSync(shipmentsFile)) {
      console.log('📋 No existing file storage data found');
      console.log('✅ Starting with fresh MongoDB database');
      return;
    }

    console.log('🔍 Found existing file storage data');
    console.log('🚀 Starting migration to MongoDB...\n');

    // Initialize MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri || mongoUri.includes('username:password')) {
      console.log('❌ Please configure MONGODB_URI in .env file first');
      process.exit(1);
    }

    await mongoStorageHelpers.init(mongoUri);

    // Get existing data from file storage
    console.log('📖 Reading data from file storage...');
    const fileData = await fileStorageHelpers.getAllShipments({ page: 1, limit: 1000 });
    
    if (fileData.data.length === 0) {
      console.log('📋 No shipments found in file storage');
      return;
    }

    console.log(`📦 Found ${fileData.data.length} shipments to migrate`);

    // Check if MongoDB already has data
    const mongoData = await mongoStorageHelpers.getAllShipments({ page: 1, limit: 10 });
    if (mongoData.data.length > 0) {
      console.log(`⚠️  MongoDB already contains ${mongoData.data.length} shipments`);
      console.log('💭 Skipping migration to avoid duplicates');
      console.log('💡 Delete MongoDB data first if you want to re-migrate');
      return;
    }

    // Migrate each shipment
    console.log('🔄 Migrating shipments...');
    let migrated = 0;
    let failed = 0;

    for (const shipment of fileData.data) {
      try {
        // Remove the file storage ID and let MongoDB create its own
        const { id, ...shipmentData } = shipment;
        await mongoStorageHelpers.addShipment(shipmentData);
        migrated++;
        console.log(`✅ Migrated: ${shipment.trackingId}`);
      } catch (error) {
        failed++;
        console.log(`❌ Failed: ${shipment.trackingId} - ${error.message}`);
      }
    }

    console.log(`\n📊 Migration Summary:`);
    console.log(`   ✅ Successfully migrated: ${migrated}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📦 Total processed: ${fileData.data.length}`);

    if (migrated > 0) {
      console.log('\n🎉 Migration completed successfully!');
      console.log('💡 Your data is now available in MongoDB');
      console.log('🔧 You can now start the server with MongoDB storage');
    }

  } catch (error) {
    console.log('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Check command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log('📖 Data Migration Tool Help');
  console.log('===========================\n');
  console.log('This tool migrates data from file storage to MongoDB.');
  console.log('');
  console.log('Prerequisites:');
  console.log('• Configure MONGODB_URI in .env file');
  console.log('• Ensure MongoDB is accessible');
  console.log('• Have existing data in file storage');
  console.log('');
  console.log('Usage:');
  console.log('  node migrate-to-mongodb.js');
  console.log('');
  console.log('The tool will:');
  console.log('• Check for existing file storage data');
  console.log('• Connect to MongoDB');
  console.log('• Migrate all shipments to MongoDB');
  console.log('• Preserve all shipment data and tracking events');
  process.exit(0);
}

migrateData();
