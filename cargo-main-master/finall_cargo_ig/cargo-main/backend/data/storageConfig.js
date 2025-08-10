// Storage configuration for the cargo tracking system
// Choose your storage method: 'memory', 'file', or 'mongodb'

const STORAGE_TYPE = process.env.STORAGE_TYPE || 'mongodb'; // Default to MongoDB storage

// MongoDB connection configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cargo-capital';

// Import storage implementations
const { mockDataHelpers } = require('./mockData');
const { fileStorageHelpers, initializeStorage } = require('./fileStorage');
const { mongoStorageHelpers } = require('./mongoStorage');

// Storage adapter - provides a unified interface regardless of storage type
class StorageAdapter {
  constructor() {
    this.storageType = STORAGE_TYPE;
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;

    switch (this.storageType) {
      case 'memory':
        console.log('📁 Using in-memory storage (data will be lost on restart)');
        break;
      case 'file':
        console.log('📁 Using file-based storage (data persisted to disk)');
        await initializeStorage();
        break;
      case 'mongodb':
        console.log('📁 Using MongoDB storage (data persisted to database)');
        await mongoStorageHelpers.init(MONGODB_URI);
        break;
      default:
        console.log('📁 Unknown storage type, falling back to file storage');
        await initializeStorage();
    }
    
    this.isInitialized = true;
  }

  getHelpers() {
    switch (this.storageType) {
      case 'memory':
        return mockDataHelpers;
      case 'file':
        return fileStorageHelpers;
      case 'mongodb':
        return mongoStorageHelpers;
      default:
        return fileStorageHelpers;
    }
  }

  async getStats() {
    const helpers = this.getHelpers();
    if (helpers.getStats) {
      return await helpers.getStats();
    }
    return { storageType: this.storageType, message: 'Stats not available' };
  }
}

// Create and export a single instance
const storageAdapter = new StorageAdapter();

module.exports = {
  storageAdapter,
  STORAGE_TYPE,
  MONGODB_URI
};
