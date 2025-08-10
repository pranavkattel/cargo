// Mock data for shipments when not using MongoDB
const mockShipments = [
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
      },
      {
        id: 'evt3',
        status: 'Customs Clearance',
        description: 'Package cleared customs',
        location: 'Heathrow Airport, London',
        timestamp: '2025-07-16T08:00:00Z',
        completed: false
      },
      {
        id: 'evt4',
        status: 'Out for Delivery',
        description: 'Package is out for delivery',
        location: 'London Distribution Center',
        timestamp: '2025-07-20T09:00:00Z',
        completed: false
      },
      {
        id: 'evt5',
        status: 'Delivered',
        description: 'Package delivered successfully',
        location: 'London, UK',
        timestamp: '2025-07-20T10:00:00Z',
        completed: false
      }
    ],
    createdAt: '2025-07-14T09:00:00Z',
    updatedAt: '2025-07-15T14:30:00Z'
  },
  {
    id: '2',
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
      estimatedDelivery: '2025-07-10T16:00:00Z'
    },
    trackingEvents: [
      {
        id: 'evt6',
        status: 'Package Picked Up',
        description: 'Package has been picked up from sender',
        location: 'Los Angeles Distribution Center',
        timestamp: '2025-07-05T10:00:00Z',
        completed: true
      },
      {
        id: 'evt7',
        status: 'In Transit',
        description: 'Package is on its way to destination',
        location: 'LAX International Airport',
        timestamp: '2025-07-06T15:00:00Z',
        completed: true
      },
      {
        id: 'evt8',
        status: 'Customs Clearance',
        description: 'Package cleared customs',
        location: 'Sydney Airport',
        timestamp: '2025-07-08T12:00:00Z',
        completed: true
      },
      {
        id: 'evt9',
        status: 'Out for Delivery',
        description: 'Package is out for delivery',
        location: 'Sydney Distribution Center',
        timestamp: '2025-07-10T08:00:00Z',
        completed: true
      },
      {
        id: 'evt10',
        status: 'Delivered',
        description: 'Package delivered successfully',
        location: 'Sydney, Australia',
        timestamp: '2025-07-10T16:00:00Z',
        completed: true
      }
    ],
    createdAt: '2025-07-05T10:00:00Z',
    updatedAt: '2025-07-10T16:00:00Z'
  },
  {
    id: '3',
    trackingId: 'CC001234569',
    status: 'Pending Pickup',
    customerInfo: {
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+65-9123-4567',
      address: '789 Marina Bay, Singapore 018956'
    },
    shipmentDetails: {
      origin: 'Singapore',
      destination: 'Tokyo, Japan',
      weight: '8kg',
      dimensions: '30x25x20cm',
      service: 'Express Regional',
      estimatedDelivery: '2025-07-18T14:00:00Z'
    },
    trackingEvents: [
      {
        id: 'evt11',
        status: 'Package Received',
        description: 'Package received at our facility',
        location: 'Singapore Hub',
        timestamp: '2025-07-15T16:00:00Z',
        completed: true
      },
      {
        id: 'evt12',
        status: 'Pending Pickup',
        description: 'Package ready for pickup',
        location: 'Singapore Hub',
        timestamp: '2025-07-16T09:00:00Z',
        completed: false
      },
      {
        id: 'evt13',
        status: 'In Transit',
        description: 'Package is on its way to destination',
        location: 'Changi Airport',
        timestamp: '2025-07-17T10:00:00Z',
        completed: false
      },
      {
        id: 'evt14',
        status: 'Out for Delivery',
        description: 'Package is out for delivery',
        location: 'Tokyo Distribution Center',
        timestamp: '2025-07-18T13:00:00Z',
        completed: false
      },
      {
        id: 'evt15',
        status: 'Delivered',
        description: 'Package delivered successfully',
        location: 'Tokyo, Japan',
        timestamp: '2025-07-18T14:00:00Z',
        completed: false
      }
    ],
    createdAt: '2025-07-15T16:00:00Z',
    updatedAt: '2025-07-16T09:00:00Z'
  }
];

// Helper functions for mock data operations
const mockDataHelpers = {
  // Find shipment by tracking ID
  findByTrackingId: (trackingId) => {
    return mockShipments.find(shipment => 
      shipment.trackingId.toUpperCase() === trackingId.toUpperCase()
    );
  },

  // Find multiple shipments by tracking IDs
  findByTrackingIds: (trackingIds) => {
    const upperIds = trackingIds.map(id => id.toUpperCase());
    return mockShipments.filter(shipment => 
      upperIds.includes(shipment.trackingId.toUpperCase())
    );
  },

  // Get all shipments with pagination and filtering
  getAllShipments: (options = {}) => {
    const { page = 1, limit = 10, status, search } = options;
    let filteredShipments = [...mockShipments];

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
  addShipment: (shipmentData) => {
    const newShipment = {
      id: (mockShipments.length + 1).toString(),
      trackingId: shipmentData.trackingId || `CC${Date.now()}`,
      status: shipmentData.status || 'Pending Pickup',
      customerInfo: shipmentData.customerInfo,
      shipmentDetails: shipmentData.shipmentDetails,
      trackingEvents: shipmentData.trackingEvents || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockShipments.push(newShipment);
    return newShipment;
  },

  // Update shipment
  updateShipment: (trackingId, updateData) => {
    const shipmentIndex = mockShipments.findIndex(shipment => 
      shipment.trackingId.toUpperCase() === trackingId.toUpperCase()
    );
    
    if (shipmentIndex === -1) return null;
    
    mockShipments[shipmentIndex] = {
      ...mockShipments[shipmentIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return mockShipments[shipmentIndex];
  },

  // Delete shipment
  deleteShipment: (trackingId) => {
    const shipmentIndex = mockShipments.findIndex(shipment => 
      shipment.trackingId.toUpperCase() === trackingId.toUpperCase()
    );
    
    if (shipmentIndex === -1) return false;
    
    mockShipments.splice(shipmentIndex, 1);
    return true;
  }
};

module.exports = {
  mockShipments,
  mockDataHelpers
};
