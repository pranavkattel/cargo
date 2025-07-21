const fs = require('fs').promises;
const path = require('path');

// File paths for data storage
const DATA_DIR = path.join(__dirname, 'storage');
const SHIPMENTS_FILE = path.join(DATA_DIR, 'shipments.json');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');

// Ensure storage directory exists
async function ensureStorageDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(BACKUP_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating storage directory:', error);
  }
}

// Initialize storage with default data if file doesn't exist
async function initializeStorage() {
  await ensureStorageDir();
  
  try {
    await fs.access(SHIPMENTS_FILE);
  } catch (error) {
    // File doesn't exist, create with initial data
    const initialData = {
      shipments: [
        {
          id: '1',
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
            estimatedDelivery: '2025-07-20T10:00:00Z'
          },
          trackingEvents: [
            {
              id: 'evt1',
              status: 'Package Picked Up',
              description: 'Package has been picked up from sender',
              location: 'New York Distribution Center',
              timestamp: '2025-07-14T09:00:00Z',
              completed: true
            },
            {
              id: 'evt2',
              status: 'In Transit',
              description: 'Package is on its way to destination',
              location: 'JFK International Airport',
              timestamp: '2025-07-15T14:30:00Z',
              completed: true
            }
          ],
          createdAt: '2025-07-14T09:00:00Z',
          updatedAt: '2025-07-15T14:30:00Z'
        }
      ],
      metadata: {
        version: '1.0',
        lastBackup: new Date().toISOString(),
        totalShipments: 1
      }
    };
    
    await saveToFile(initialData);
    console.log('✅ Initialized file-based storage with sample data');
  }
}

// Read data from file
async function loadFromFile() {
  try {
    const data = await fs.readFile(SHIPMENTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading shipments file:', error);
    await initializeStorage();
    return await loadFromFile();
  }
}

// Save data to file with backup
async function saveToFile(data) {
  try {
    // Create backup before saving
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(BACKUP_DIR, `shipments-${timestamp}.json`);
    
    // Update metadata
    data.metadata = {
      ...data.metadata,
      lastUpdated: new Date().toISOString(),
      totalShipments: data.shipments.length
    };
    
    // Save main file
    await fs.writeFile(SHIPMENTS_FILE, JSON.stringify(data, null, 2));
    
    // Create backup (keep only last 10 backups)
    await fs.writeFile(backupFile, JSON.stringify(data, null, 2));
    await cleanupOldBackups();
    
    console.log(`💾 Data saved successfully (${data.shipments.length} shipments)`);
  } catch (error) {
    console.error('Error saving shipments file:', error);
  }
}

// Clean up old backup files (keep only last 10)
async function cleanupOldBackups() {
  try {
    const files = await fs.readdir(BACKUP_DIR);
    const backupFiles = files
      .filter(file => file.startsWith('shipments-') && file.endsWith('.json'))
      .sort()
      .reverse();
    
    if (backupFiles.length > 10) {
      const filesToDelete = backupFiles.slice(10);
      for (const file of filesToDelete) {
        await fs.unlink(path.join(BACKUP_DIR, file));
      }
      console.log(`🗑️ Cleaned up ${filesToDelete.length} old backup files`);
    }
  } catch (error) {
    console.error('Error cleaning up backups:', error);
  }
}

// File-based storage helpers
const fileStorageHelpers = {
  // Initialize storage
  init: initializeStorage,

  // Find shipment by tracking ID
  findByTrackingId: async (trackingId) => {
    const data = await loadFromFile();
    return data.shipments.find(shipment => 
      shipment.trackingId.toUpperCase() === trackingId.toUpperCase()
    );
  },

  // Find multiple shipments by tracking IDs
  findByTrackingIds: async (trackingIds) => {
    const data = await loadFromFile();
    const upperIds = trackingIds.map(id => id.toUpperCase());
    return data.shipments.filter(shipment => 
      upperIds.includes(shipment.trackingId.toUpperCase())
    );
  },

  // Get all shipments with pagination and filtering
  getAllShipments: async (options = {}) => {
    const data = await loadFromFile();
    const { page = 1, limit = 10, status, search } = options;
    let filteredShipments = [...data.shipments];

    // Filter by status
    if (status) {
      filteredShipments = filteredShipments.filter(shipment => 
        shipment.status.toLowerCase() === status.toLowerCase()
      );
    }

    // Filter by search term
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredShipments = filteredShipments.filter(shipment => 
        shipment.trackingId.toLowerCase().includes(searchTerm) ||
        shipment.customerInfo.name.toLowerCase().includes(searchTerm) ||
        shipment.customerInfo.email.toLowerCase().includes(searchTerm)
      );
    }

    // Sort by creation date (newest first)
    filteredShipments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const skip = (page - 1) * limit;
    const paginatedShipments = filteredShipments.slice(skip, skip + limit);

    return {
      data: paginatedShipments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredShipments.length,
        pages: Math.ceil(filteredShipments.length / limit)
      }
    };
  },

  // Add a new shipment
  addShipment: async (shipmentData) => {
    const data = await loadFromFile();
    
    const newShipment = {
      id: (data.shipments.length + 1).toString(),
      trackingId: shipmentData.trackingId || `CC${Date.now()}`,
      status: shipmentData.status || 'Pending Pickup',
      customerInfo: shipmentData.customerInfo,
      shipmentDetails: shipmentData.shipmentDetails,
      trackingEvents: shipmentData.trackingEvents || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    data.shipments.push(newShipment);
    await saveToFile(data);
    return newShipment;
  },

  // Update shipment
  updateShipment: async (trackingId, updateData) => {
    const data = await loadFromFile();
    const shipmentIndex = data.shipments.findIndex(shipment => 
      shipment.trackingId.toUpperCase() === trackingId.toUpperCase()
    );
    
    if (shipmentIndex === -1) return null;
    
    data.shipments[shipmentIndex] = {
      ...data.shipments[shipmentIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    await saveToFile(data);
    return data.shipments[shipmentIndex];
  },

  // Delete shipment
  deleteShipment: async (trackingId) => {
    const data = await loadFromFile();
    const shipmentIndex = data.shipments.findIndex(shipment => 
      shipment.trackingId.toUpperCase() === trackingId.toUpperCase()
    );
    
    if (shipmentIndex === -1) return false;
    
    data.shipments.splice(shipmentIndex, 1);
    await saveToFile(data);
    return true;
  },

  // Get storage statistics
  getStats: async () => {
    const data = await loadFromFile();
    const stats = await fs.stat(SHIPMENTS_FILE);
    
    return {
      totalShipments: data.shipments.length,
      fileSize: `${(stats.size / 1024).toFixed(2)} KB`,
      lastUpdated: data.metadata?.lastUpdated,
      version: data.metadata?.version
    };
  }
};

module.exports = {
  fileStorageHelpers,
  initializeStorage
};
