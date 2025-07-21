#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Cargo Capital - MongoDB Setup');
console.log('================================\n');

console.log('This script will help you configure MongoDB for your Cargo Capital system.\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📋 Creating .env file from template...');
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file\n');
  } else {
    console.log('❌ .env.example not found\n');
  }
}

console.log('📝 NEXT STEPS:');
console.log('==============');
console.log('');
console.log('1. Open the .env file in this directory');
console.log('2. Replace the MONGODB_URI with your actual connection string:');
console.log('   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/cargo-capital');
console.log('');
console.log('3. Your MongoDB connection string format should be:');
console.log('   mongodb+srv://username:password@cluster.mongodb.net/cargo-capital?retryWrites=true&w=majority');
console.log('');
console.log('4. Make sure your database name is "cargo-capital"');
console.log('');
console.log('5. Start the server with: npm start');
console.log('');
console.log('🔧 MONGODB ATLAS SETUP:');
console.log('======================');
console.log('');
console.log('1. Go to MongoDB Atlas (https://cloud.mongodb.com/)');
console.log('2. Create a cluster if you haven\'t already');
console.log('3. Create a database named "cargo-capital"');
console.log('4. Create a collection named "shipments"');
console.log('5. Go to Database Access and create a user');
console.log('6. Go to Network Access and whitelist your IP (or 0.0.0.0/0 for all)');
console.log('7. Click "Connect" and choose "Connect your application"');
console.log('8. Copy the connection string and paste it in the .env file');
console.log('');
console.log('💡 TIPS:');
console.log('========');
console.log('');
console.log('• The system will automatically create sample data if the database is empty');
console.log('• You can switch between storage types by changing STORAGE_TYPE in .env');
console.log('• Available options: mongodb, file, memory');
console.log('• The tracking ID "CC001234567" will be available for testing');
console.log('');

// Check current configuration
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const mongoUri = envContent.match(/MONGODB_URI=(.+)/);
  
  if (mongoUri && mongoUri[1] && !mongoUri[1].includes('username:password')) {
    console.log('✅ MongoDB URI appears to be configured!');
    console.log('🚀 You can now start the server with: npm start');
  } else {
    console.log('⚠️  Please update your MONGODB_URI in the .env file');
  }
}
