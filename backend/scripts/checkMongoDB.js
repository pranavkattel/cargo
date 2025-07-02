const mongoose = require('mongoose');

async function checkMongoDB() {
  try {
    console.log('Checking MongoDB connection...');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cargo-capital', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    });

    console.log('✅ MongoDB is running and accessible');
    console.log('✅ Database connection successful');
    
    await mongoose.connection.close();
    return true;
  } catch (error) {
    console.log('❌ MongoDB connection failed:', error.message);
    console.log('');
    console.log('MongoDB is not running or not accessible.');
    console.log('Please ensure MongoDB is installed and running:');
    console.log('');
    console.log('Windows:');
    console.log('1. Install MongoDB Community Server from https://www.mongodb.com/try/download/community');
    console.log('2. Start MongoDB service or run: mongod');
    console.log('');
    console.log('Alternative: Use MongoDB Atlas (cloud):');
    console.log('1. Create account at https://www.mongodb.com/atlas');
    console.log('2. Create cluster and get connection string');
    console.log('3. Update MONGODB_URI in .env file');
    console.log('');
    return false;
  }
}

if (require.main === module) {
  checkMongoDB().then(() => process.exit(0));
}

module.exports = checkMongoDB;
