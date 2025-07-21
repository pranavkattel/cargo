const express = require('express');
const router = express.Router();

// Get all shipments with pagination
router.get('/shipments', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const search = req.query.search;

    const result = await req.storage.getAllShipments({
      page,
      limit,
      status,
      search
    });

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Get shipments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve shipments',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get shipment by ID or tracking ID
router.get('/shipments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find by tracking ID (since we're using mock data, we'll use tracking ID as primary identifier)
    const shipment = req.storage.findByTrackingId(id);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    res.json({
      success: true,
      data: shipment
    });
  } catch (error) {
    console.error('Get shipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve shipment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Create new shipment
router.post('/shipments', async (req, res) => {
  try {
    const shipmentData = req.body;
    
    // Debug logging
    console.log('📦 Creating shipment with data:', JSON.stringify(shipmentData, null, 2));
    
    // Validate required fields
    const requiredFields = ['customerInfo', 'shipmentDetails'];
    for (const field of requiredFields) {
      if (!shipmentData[field]) {
        console.log(`❌ Missing required field: ${field}`);
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }

    // Validate customerInfo fields
    if (shipmentData.customerInfo) {
      const requiredCustomerFields = ['name', 'email', 'phone', 'address'];
      for (const field of requiredCustomerFields) {
        if (!shipmentData.customerInfo[field] || shipmentData.customerInfo[field].trim() === '') {
          console.log(`❌ Missing customerInfo.${field}`);
          return res.status(400).json({
            success: false,
            message: `customerInfo.${field} is required`
          });
        }
      }
    }

    // Validate shipmentDetails fields
    if (shipmentData.shipmentDetails) {
      const requiredShipmentFields = ['origin', 'destination', 'weight'];
      for (const field of requiredShipmentFields) {
        if (!shipmentData.shipmentDetails[field] || 
            (typeof shipmentData.shipmentDetails[field] === 'string' && shipmentData.shipmentDetails[field].trim() === '')) {
          console.log(`❌ Missing shipmentDetails.${field}`);
          return res.status(400).json({
            success: false,
            message: `shipmentDetails.${field} is required`
          });
        }
      }
      
      // Provide defaults for optional fields
      if (!shipmentData.shipmentDetails.description || shipmentData.shipmentDetails.description.trim() === '') {
        shipmentData.shipmentDetails.description = 'General cargo';
        console.log('📦 No description provided, using default');
      }
      if (!shipmentData.shipmentDetails.serviceType || shipmentData.shipmentDetails.serviceType.trim() === '') {
        shipmentData.shipmentDetails.serviceType = 'standard';
        console.log('🚚 No service type provided, using default');
      }
    }

    // Auto-generate tracking ID if not provided
    if (!shipmentData.trackingId) {
      const prefix = 'CC';
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.random().toString(36).substring(2, 5).toUpperCase();
      shipmentData.trackingId = `${prefix}${timestamp}${random}`;
      console.log(`🏷️ Generated tracking ID: ${shipmentData.trackingId}`);
    }

    // Check if tracking ID already exists
    const existingShipment = await req.storage.findByTrackingId(shipmentData.trackingId);
    if (existingShipment) {
      return res.status(400).json({
        success: false,
        message: 'Tracking ID already exists'
      });
    }

    // Set default status if not provided or invalid
    const validStatuses = ['processing', 'picked-up', 'in-transit', 'out-for-delivery', 'delivered', 'failed-delivery', 'returned', 'cancelled'];
    if (!shipmentData.status || !validStatuses.includes(shipmentData.status)) {
      shipmentData.status = 'processing'; // Use correct lowercase format
      console.log('📊 Invalid or missing status, using default: processing');
    }

    // Set estimated delivery date if not provided
    if (!shipmentData.estimatedDelivery) {
      const now = new Date();
      const daysToAdd = 5; // Default 5 days
      shipmentData.estimatedDelivery = new Date(now.getTime() + (daysToAdd * 24 * 60 * 60 * 1000)).toISOString();
    }

    // Create initial tracking event
    const initialEvent = {
      id: 'evt_' + Date.now(),
      status: 'processing',
      description: 'Shipment received and processing has begun',
      location: shipmentData.shipmentDetails.origin,
      timestamp: new Date().toISOString(),
      completed: false
    };

    // Prepare shipment data for MongoDB storage
    const newShipmentData = {
      trackingId: shipmentData.trackingId,
      status: shipmentData.status,
      customerInfo: shipmentData.customerInfo,
      shipmentDetails: {
        ...shipmentData.shipmentDetails,
        serviceType: shipmentData.shipmentDetails.serviceType || 'standard'
      },
      events: [initialEvent],
      estimatedDelivery: shipmentData.estimatedDelivery
    };

    console.log('💾 Creating shipment with data:', newShipmentData);
    const shipment = await req.storage.addShipment(newShipmentData);
    console.log('✅ Shipment created successfully with ID:', shipment.trackingId);

    res.status(201).json({
      success: true,
      data: shipment,
      message: 'Shipment created successfully'
    });
  } catch (error) {
    console.error('❌ Create shipment error:', error);
    console.error('📋 Request body was:', JSON.stringify(req.body, null, 2));
    
    res.status(500).json({
      success: false,
      message: 'Failed to create shipment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Update shipment by ID or tracking ID
router.put('/shipments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const shipment = await req.storage.updateShipment(id, updateData);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    res.json({
      success: true,
      data: shipment,
      message: 'Shipment updated successfully'
    });
  } catch (error) {
    console.error('Update shipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update shipment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update shipment status by ID or tracking ID
router.put('/shipments/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    // Validate status against allowed values
    const validStatuses = ['processing', 'picked-up', 'in-transit', 'out-for-delivery', 'delivered', 'failed-delivery', 'returned', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        validStatuses: validStatuses
      });
    }

    console.log(`🔄 Updating status for ${id} to: ${status}`);

    const shipment = await req.storage.updateShipment(id, { 
      status,
      updatedAt: new Date().toISOString()
    });

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    console.log(`✅ Status updated successfully for ${shipment.trackingId}`);

    res.json({
      success: true,
      data: shipment,
      message: 'Shipment status updated successfully'
    });
  } catch (error) {
    console.error('❌ Update shipment status error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to update shipment status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Add tracking event to shipment by ID or tracking ID
router.post('/shipments/:id/events', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, description, location } = req.body;
    
    if (!status || !description || !location) {
      return res.status(400).json({
        success: false,
        message: 'status, description, and location are required'
      });
    }

    const shipment = req.storage.findByTrackingId(id);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    // Add new tracking event
    const newEvent = {
      id: 'evt_' + Date.now(),
      status,
      description,
      location,
      timestamp: new Date().toISOString(),
      completed: true
    };

    shipment.trackingEvents.push(newEvent);
    
    // Update the shipment
    const updatedShipment = req.storage.updateShipment(id, {
      trackingEvents: shipment.trackingEvents,
      status: status,
      updatedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      data: updatedShipment,
      message: 'Tracking event added successfully'
    });
  } catch (error) {
    console.error('Add tracking event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add tracking event',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Delete shipment by ID or tracking ID
router.delete('/shipments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const success = req.storage.deleteShipment(id);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    res.json({
      success: true,
      message: 'Shipment deleted successfully'
    });
  } catch (error) {
    console.error('Delete shipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete shipment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update delivery status with predefined options (dropdown)
router.put('/shipments/:id/delivery-status', async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveryStatus } = req.body;
    
    // Predefined delivery status options (dropdown values)
    const validStatuses = [
      'processing',
      'picked-up',
      'in-transit',
      'out-for-delivery',
      'delivered',
      'failed-delivery',
      'returned',
      'cancelled'
    ];
    
    if (!deliveryStatus) {
      return res.status(400).json({
        success: false,
        message: 'Delivery status is required'
      });
    }
    
    if (!validStatuses.includes(deliveryStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid delivery status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Try to find by MongoDB ObjectId first, then by trackingId
    let shipment;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // Valid ObjectId format
      shipment = await Shipment.findByIdAndUpdate(
        id,
        { 
          status: deliveryStatus,
          lastUpdated: new Date()
        },
        { new: true, runValidators: true }
      );
    } else {
      // Assume it's a tracking ID
      shipment = await Shipment.findOneAndUpdate(
        { trackingId: id },
        { 
          status: deliveryStatus,
          lastUpdated: new Date()
        },
        { new: true, runValidators: true }
      );
    }

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    // Add tracking event for status change
    const statusDescriptions = {
      'processing': 'Order is being processed',
      'picked-up': 'Package has been picked up by carrier',
      'in-transit': 'Package is in transit to destination',
      'out-for-delivery': 'Package is out for delivery',
      'delivered': 'Package has been delivered successfully',
      'failed-delivery': 'Delivery attempt failed',
      'returned': 'Package has been returned to sender',
      'cancelled': 'Shipment has been cancelled'
    };

    await shipment.addTrackingEvent(
      deliveryStatus,
      statusDescriptions[deliveryStatus],
      shipment.shipmentDetails.destination
    );

    res.json({
      success: true,
      data: shipment,
      message: `Delivery status updated to: ${deliveryStatus}`
    });
  } catch (error) {
    console.error('Update delivery status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update delivery status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update estimated delivery time
router.put('/shipments/:id/estimated-delivery', async (req, res) => {
  try {
    const { id } = req.params;
    const { estimatedDelivery } = req.body;
    
    if (!estimatedDelivery) {
      return res.status(400).json({
        success: false,
        message: 'Estimated delivery time is required'
      });
    }
    
    // Validate date format
    const deliveryDate = new Date(estimatedDelivery);
    if (isNaN(deliveryDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Please use ISO date format (YYYY-MM-DDTHH:mm:ss.sssZ)'
      });
    }
    
    // Check if date is in the future
    if (deliveryDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Estimated delivery time must be in the future'
      });
    }

    // Try to find by MongoDB ObjectId first, then by trackingId
    let shipment;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // Valid ObjectId format
      shipment = await Shipment.findByIdAndUpdate(
        id,
        { 
          estimatedDelivery: deliveryDate,
          lastUpdated: new Date()
        },
        { new: true, runValidators: true }
      );
    } else {
      // Assume it's a tracking ID
      shipment = await Shipment.findOneAndUpdate(
        { trackingId: id },
        { 
          estimatedDelivery: deliveryDate,
          lastUpdated: new Date()
        },
        { new: true, runValidators: true }
      );
    }

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    res.json({
      success: true,
      data: shipment,
      message: `Estimated delivery time updated to: ${deliveryDate.toLocaleString()}`
    });
  } catch (error) {
    console.error('Update estimated delivery error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update estimated delivery time',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Enhanced delete with confirmation and audit trail
router.delete('/shipments/:id/confirm', async (req, res) => {
  try {
    const { id } = req.params;
    const { confirmDelete, reason } = req.body;
    
    if (!confirmDelete || confirmDelete !== true) {
      return res.status(400).json({
        success: false,
        message: 'Delete confirmation required. Set confirmDelete: true'
      });
    }
    
    if (!reason || reason.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Deletion reason is required (minimum 3 characters)'
      });
    }

    // Try to find by MongoDB ObjectId first, then by trackingId
    let shipment;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // Valid ObjectId format
      shipment = await Shipment.findById(id);
    } else {
      // Assume it's a tracking ID
      shipment = await Shipment.findOne({ trackingId: id });
    }

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    // Store shipment data for audit trail before deletion
    const auditData = {
      deletedAt: new Date(),
      deletedShipment: {
        trackingId: shipment.trackingId,
        customerName: shipment.customerInfo?.name || 'Unknown',
        status: shipment.status,
        origin: shipment.shipmentDetails?.origin || 'Unknown',
        destination: shipment.shipmentDetails?.destination || 'Unknown'
      },
      deletionReason: reason
    };

    console.log('🗑️ Shipment Deletion Audit:', auditData);

    // Add final tracking event before deletion
    await shipment.addTrackingEvent(
      'cancelled',
      `Shipment deleted: ${reason}`,
      shipment.shipmentDetails?.destination || 'System'
    );

    // Delete the shipment
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      await Shipment.findByIdAndDelete(id);
    } else {
      await Shipment.findOneAndDelete({ trackingId: id });
    }

    res.json({
      success: true,
      message: 'Shipment deleted successfully',
      auditInfo: {
        trackingId: auditData.deletedShipment.trackingId,
        deletedAt: auditData.deletedAt,
        reason: reason
      }
    });
  } catch (error) {
    console.error('Delete shipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete shipment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ========================================
// DROPDOWN HELPER ENDPOINTS
// ========================================

// Get comprehensive dropdown options for all fields
router.get('/dropdown-options', (req, res) => {
  const dropdownOptions = {
    status: [
      { value: 'processing', label: 'Processing', description: 'Order is being processed', color: '#f59e0b', icon: '⏳' },
      { value: 'picked-up', label: 'Picked Up', description: 'Package picked up by carrier', color: '#3b82f6', icon: '📦' },
      { value: 'in-transit', label: 'In Transit', description: 'Package is on the way', color: '#8b5cf6', icon: '🚚' },
      { value: 'out-for-delivery', label: 'Out for Delivery', description: 'Package is out for delivery', color: '#f97316', icon: '🚛' },
      { value: 'delivered', label: 'Delivered', description: 'Package delivered successfully', color: '#10b981', icon: '✅' },
      { value: 'failed-delivery', label: 'Failed Delivery', description: 'Delivery attempt failed', color: '#ef4444', icon: '❌' },
      { value: 'returned', label: 'Returned', description: 'Package returned to sender', color: '#6b7280', icon: '↩️' },
      { value: 'cancelled', label: 'Cancelled', description: 'Shipment cancelled', color: '#dc2626', icon: '🚫' }
    ],
    serviceType: [
      { 
        value: 'standard', 
        label: 'Standard Delivery', 
        description: '5-7 business days',
        estimatedDays: 5,
        price: '$15.99',
        icon: '📮',
        popular: false
      },
      { 
        value: 'express', 
        label: 'Express Delivery', 
        description: '2-3 business days',
        estimatedDays: 2,
        price: '$29.99',
        icon: '⚡',
        popular: true
      },
      { 
        value: 'overnight', 
        label: 'Overnight Delivery', 
        description: 'Next business day',
        estimatedDays: 1,
        price: '$49.99',
        icon: '🌙',
        popular: false
      },
      { 
        value: 'international', 
        label: 'International Shipping', 
        description: '7-14 business days',
        estimatedDays: 10,
        price: '$89.99',
        icon: '🌍',
        popular: false
      },
      { 
        value: 'freight', 
        label: 'Freight Shipping', 
        description: '5-10 business days for large items',
        estimatedDays: 7,
        price: '$199.99',
        icon: '🏗️',
        popular: false
      }
    ],
    countries: [
      { value: 'US', label: 'United States', region: 'North America', code: 'US' },
      { value: 'CA', label: 'Canada', region: 'North America', code: 'CA' },
      { value: 'GB', label: 'United Kingdom', region: 'Europe', code: 'GB' },
      { value: 'DE', label: 'Germany', region: 'Europe', code: 'DE' },
      { value: 'FR', label: 'France', region: 'Europe', code: 'FR' },
      { value: 'JP', label: 'Japan', region: 'Asia', code: 'JP' },
      { value: 'AU', label: 'Australia', region: 'Oceania', code: 'AU' },
      { value: 'BR', label: 'Brazil', region: 'South America', code: 'BR' },
      { value: 'IN', label: 'India', region: 'Asia', code: 'IN' },
      { value: 'MX', label: 'Mexico', region: 'North America', code: 'MX' }
    ],
    weightUnits: [
      { value: 'lbs', label: 'Pounds (lbs)', description: 'Imperial weight unit' },
      { value: 'kg', label: 'Kilograms (kg)', description: 'Metric weight unit' },
      { value: 'oz', label: 'Ounces (oz)', description: 'For light packages' }
    ],
    dimensionUnits: [
      { value: 'in', label: 'Inches (in)', description: 'Imperial dimension unit' },
      { value: 'cm', label: 'Centimeters (cm)', description: 'Metric dimension unit' },
      { value: 'ft', label: 'Feet (ft)', description: 'For large packages' }
    ],
    packageTypes: [
      { value: 'box', label: 'Box', description: 'Standard cardboard box', icon: '📦' },
      { value: 'envelope', label: 'Envelope', description: 'Document envelope', icon: '✉️' },
      { value: 'tube', label: 'Tube', description: 'Cylindrical container', icon: '🗞️' },
      { value: 'pallet', label: 'Pallet', description: 'Large freight pallet', icon: '🏗️' },
      { value: 'custom', label: 'Custom', description: 'Custom packaging', icon: '📋' }
    ],
    priorities: [
      { value: 'low', label: 'Low Priority', description: 'Standard processing', color: '#6b7280' },
      { value: 'normal', label: 'Normal Priority', description: 'Regular processing', color: '#3b82f6' },
      { value: 'high', label: 'High Priority', description: 'Expedited processing', color: '#f59e0b' },
      { value: 'urgent', label: 'Urgent', description: 'Immediate attention required', color: '#ef4444' }
    ],
    insuranceOptions: [
      { value: 'none', label: 'No Insurance', description: 'No additional coverage', price: '$0.00' },
      { value: 'basic', label: 'Basic Coverage', description: 'Up to $100 coverage', price: '$2.99' },
      { value: 'standard', label: 'Standard Coverage', description: 'Up to $500 coverage', price: '$9.99' },
      { value: 'premium', label: 'Premium Coverage', description: 'Up to $2000 coverage', price: '$29.99' },
      { value: 'custom', label: 'Custom Coverage', description: 'Custom insurance amount', price: 'Variable' }
    ]
  };

  res.json({
    success: true,
    data: dropdownOptions,
    message: 'All dropdown options retrieved successfully',
    metadata: {
      lastUpdated: new Date().toISOString(),
      version: '1.0',
      totalOptions: Object.keys(dropdownOptions).reduce((total, key) => total + dropdownOptions[key].length, 0)
    }
  });
});

// Get service recommendations based on criteria
router.post('/service-recommendations', (req, res) => {
  try {
    const { urgency, budget, destination, weight, packageType } = req.body;
    
    const serviceOptions = [
      { 
        value: 'standard', 
        label: 'Standard Delivery', 
        estimatedDays: 5,
        price: 15.99,
        urgencyScore: 1,
        budgetScore: 5,
        weightLimit: 70,
        international: false
      },
      { 
        value: 'express', 
        label: 'Express Delivery', 
        estimatedDays: 2,
        price: 29.99,
        urgencyScore: 4,
        budgetScore: 3,
        weightLimit: 50,
        international: false
      },
      { 
        value: 'overnight', 
        label: 'Overnight Delivery', 
        estimatedDays: 1,
        price: 49.99,
        urgencyScore: 5,
        budgetScore: 2,
        weightLimit: 30,
        international: false
      },
      { 
        value: 'international', 
        label: 'International Shipping', 
        estimatedDays: 10,
        price: 89.99,
        urgencyScore: 2,
        budgetScore: 1,
        weightLimit: 100,
        international: true
      },
      { 
        value: 'freight', 
        label: 'Freight Shipping', 
        estimatedDays: 7,
        price: 199.99,
        urgencyScore: 2,
        budgetScore: 1,
        weightLimit: 1000,
        international: true
      }
    ];

    let recommendations = serviceOptions.map(service => {
      let score = 0;
      let reasons = [];
      
      // Urgency scoring
      if (urgency === 'urgent' && service.urgencyScore >= 4) {
        score += 30;
        reasons.push('Matches urgent delivery requirement');
      } else if (urgency === 'normal' && service.urgencyScore >= 2) {
        score += 20;
        reasons.push('Good for normal delivery timeline');
      }
      
      // Budget scoring
      if (budget) {
        const budgetNum = parseFloat(budget.replace('$', ''));
        if (service.price <= budgetNum) {
          score += 25;
          reasons.push('Within budget');
        } else {
          score -= 15;
          reasons.push('Over budget');
        }
      }
      
      // Destination scoring
      const isInternational = destination && !['US', 'United States'].includes(destination);
      if (isInternational && service.international) {
        score += 20;
        reasons.push('Supports international delivery');
      } else if (!isInternational && !service.international) {
        score += 15;
        reasons.push('Optimized for domestic delivery');
      }
      
      // Weight scoring
      if (weight) {
        const weightNum = parseFloat(weight);
        if (weightNum <= service.weightLimit) {
          score += 15;
          reasons.push('Supports package weight');
        } else {
          score -= 20;
          reasons.push('Exceeds weight limit');
        }
      }
      
      // Package type bonus
      if (packageType === 'envelope' && service.value === 'express') {
        score += 10;
        reasons.push('Ideal for document delivery');
      } else if (packageType === 'pallet' && service.value === 'freight') {
        score += 15;
        reasons.push('Designed for freight shipments');
      }
      
      return {
        ...service,
        recommendationScore: Math.max(0, score),
        reasons: reasons,
        recommended: score >= 40
      };
    });

    // Sort by recommendation score
    recommendations.sort((a, b) => b.recommendationScore - a.recommendationScore);
    
    // Add ranking
    recommendations = recommendations.map((rec, index) => ({
      ...rec,
      rank: index + 1,
      confidence: rec.recommendationScore >= 60 ? 'high' : rec.recommendationScore >= 40 ? 'medium' : 'low'
    }));

    res.json({
      success: true,
      data: {
        recommendations: recommendations,
        criteria: { urgency, budget, destination, weight, packageType },
        topRecommendation: recommendations[0],
        alternativeOptions: recommendations.slice(1, 3)
      },
      message: 'Service recommendations generated successfully'
    });
  } catch (error) {
    console.error('Service recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate service recommendations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get filtered dropdown options based on context
router.get('/dropdown-options/:category', (req, res) => {
  try {
    const { category } = req.params;
    const { filter, region, priceRange } = req.query;
    
    const allOptions = {
      status: [
        { value: 'processing', label: 'Processing', description: 'Order is being processed', color: '#f59e0b', icon: '⏳' },
        { value: 'picked-up', label: 'Picked Up', description: 'Package picked up by carrier', color: '#3b82f6', icon: '📦' },
        { value: 'in-transit', label: 'In Transit', description: 'Package is on the way', color: '#8b5cf6', icon: '🚚' },
        { value: 'out-for-delivery', label: 'Out for Delivery', description: 'Package is out for delivery', color: '#f97316', icon: '🚛' },
        { value: 'delivered', label: 'Delivered', description: 'Package delivered successfully', color: '#10b981', icon: '✅' },
        { value: 'failed-delivery', label: 'Failed Delivery', description: 'Delivery attempt failed', color: '#ef4444', icon: '❌' },
        { value: 'returned', label: 'Returned', description: 'Package returned to sender', color: '#6b7280', icon: '↩️' },
        { value: 'cancelled', label: 'Cancelled', description: 'Shipment cancelled', color: '#dc2626', icon: '🚫' }
      ],
      serviceType: [
        { value: 'standard', label: 'Standard Delivery', estimatedDays: 5, price: 15.99, popular: false },
        { value: 'express', label: 'Express Delivery', estimatedDays: 2, price: 29.99, popular: true },
        { value: 'overnight', label: 'Overnight Delivery', estimatedDays: 1, price: 49.99, popular: false },
        { value: 'international', label: 'International Shipping', estimatedDays: 10, price: 89.99, popular: false },
        { value: 'freight', label: 'Freight Shipping', estimatedDays: 7, price: 199.99, popular: false }
      ],
      countries: [
        { value: 'US', label: 'United States', region: 'North America' },
        { value: 'CA', label: 'Canada', region: 'North America' },
        { value: 'GB', label: 'United Kingdom', region: 'Europe' },
        { value: 'DE', label: 'Germany', region: 'Europe' },
        { value: 'FR', label: 'France', region: 'Europe' },
        { value: 'JP', label: 'Japan', region: 'Asia' },
        { value: 'AU', label: 'Australia', region: 'Oceania' },
        { value: 'BR', label: 'Brazil', region: 'South America' },
        { value: 'IN', label: 'India', region: 'Asia' },
        { value: 'MX', label: 'Mexico', region: 'North America' }
      ]
    };

    if (!allOptions[category]) {
      return res.status(404).json({
        success: false,
        message: `Category '${category}' not found`,
        availableCategories: Object.keys(allOptions)
      });
    }

    let options = allOptions[category];

    // Apply filters
    if (filter) {
      options = options.filter(option => 
        option.label.toLowerCase().includes(filter.toLowerCase()) ||
        option.value.toLowerCase().includes(filter.toLowerCase())
      );
    }

    if (region && category === 'countries') {
      options = options.filter(option => option.region === region);
    }

    if (priceRange && category === 'serviceType') {
      const [min, max] = priceRange.split('-').map(p => parseFloat(p));
      options = options.filter(option => option.price >= min && option.price <= max);
    }

    res.json({
      success: true,
      data: options,
      category: category,
      appliedFilters: { filter, region, priceRange },
      totalResults: options.length,
      message: `${category} options retrieved successfully`
    });
  } catch (error) {
    console.error('Filtered dropdown options error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve filtered options',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Validate address format
router.post('/validate-address', (req, res) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Address is required for validation'
      });
    }

    const { street, city, state, zipCode, country } = address;
    const errors = [];
    const suggestions = [];

    // Basic validation
    if (!street || street.trim().length < 5) {
      errors.push('Street address must be at least 5 characters long');
      suggestions.push('Include house/building number and street name');
    }

    if (!city || city.trim().length < 2) {
      errors.push('City is required and must be at least 2 characters');
    }

    if (!state || state.trim().length < 2) {
      errors.push('State/Province is required');
      suggestions.push('Use 2-letter state code (e.g., CA, NY, TX)');
    }

    if (!zipCode || !/^\d{5}(-\d{4})?$/.test(zipCode.trim())) {
      errors.push('ZIP code must be in format 12345 or 12345-6789');
      suggestions.push('Use 5-digit ZIP code or ZIP+4 format');
    }

    if (!country) {
      errors.push('Country is required');
      suggestions.push('Select country from dropdown');
    }

    const isValid = errors.length === 0;
    
    // Generate formatted address if valid
    let formattedAddress = null;
    if (isValid) {
      formattedAddress = `${street.trim()}, ${city.trim()}, ${state.trim()} ${zipCode.trim()}, ${country.trim()}`;
    }

    res.json({
      success: true,
      data: {
        isValid,
        errors,
        suggestions,
        formattedAddress,
        validationScore: Math.max(0, 100 - (errors.length * 20)),
        addressComponents: {
          street: street?.trim(),
          city: city?.trim(),
          state: state?.trim(),
          zipCode: zipCode?.trim(),
          country: country?.trim()
        }
      },
      message: isValid ? 'Address is valid' : 'Address validation failed'
    });
  } catch (error) {
    console.error('Address validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Address validation failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Validate tracking ID format
router.post('/validate-tracking-id', (req, res) => {
  try {
    const { trackingId } = req.body;
    
    if (!trackingId) {
      return res.status(400).json({
        success: false,
        message: 'Tracking ID is required for validation'
      });
    }

    const cleanTrackingId = trackingId.trim().toUpperCase();
    const errors = [];
    const suggestions = [];

    // Validate tracking ID format (should be like TRK-YYYYMMDD-XXXX)
    const trackingPattern = /^TRK-\d{8}-[A-Z0-9]{4}$/;
    
    if (!trackingPattern.test(cleanTrackingId)) {
      errors.push('Invalid tracking ID format');
      suggestions.push('Tracking ID should be in format: TRK-YYYYMMDD-XXXX');
      suggestions.push('Example: TRK-20241215-A1B2');
    }

    // Check if tracking ID already exists (async check would go here)
    // For now, we'll just validate format

    const isValid = errors.length === 0;
    
    res.json({
      success: true,
      data: {
        isValid,
        errors,
        suggestions,
        formattedTrackingId: cleanTrackingId,
        validationScore: isValid ? 100 : 0
      },
      message: isValid ? 'Tracking ID format is valid' : 'Tracking ID validation failed'
    });
  } catch (error) {
    console.error('Tracking ID validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Tracking ID validation failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get shipment statistics for dashboard
router.get('/statistics', async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (timeframe) {
      case '7d':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } };
        break;
      case '30d':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } };
        break;
      case '90d':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) } };
        break;
      default:
        dateFilter = {};
    }

    // Get total counts
    const totalShipments = await Shipment.countDocuments(dateFilter);
    const deliveredShipments = await Shipment.countDocuments({ ...dateFilter, status: 'delivered' });
    const inTransitShipments = await Shipment.countDocuments({ ...dateFilter, status: 'in-transit' });
    const processingShipments = await Shipment.countDocuments({ ...dateFilter, status: 'processing' });

    // Get status breakdown
    const statusBreakdown = await Shipment.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get service type breakdown
    const serviceTypeBreakdown = await Shipment.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$serviceType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Calculate performance metrics
    const deliveryRate = totalShipments > 0 ? ((deliveredShipments / totalShipments) * 100).toFixed(1) : 0;
    const activeShipments = inTransitShipments + processingShipments;

    res.json({
      success: true,
      data: {
        summary: {
          totalShipments,
          deliveredShipments,
          inTransitShipments,
          processingShipments,
          activeShipments,
          deliveryRate: parseFloat(deliveryRate)
        },
        breakdowns: {
          status: statusBreakdown,
          serviceType: serviceTypeBreakdown
        },
        metrics: {
          timeframe,
          generatedAt: new Date().toISOString(),
          performanceScore: deliveryRate >= 90 ? 'excellent' : deliveryRate >= 75 ? 'good' : 'needs-improvement'
        }
      },
      message: 'Shipment statistics retrieved successfully'
    });
  } catch (error) {
    console.error('Statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Bulk operations endpoint
router.post('/bulk-update', async (req, res) => {
  try {
    const { operation, shipmentIds, updateData } = req.body;
    
    if (!operation || !shipmentIds || !Array.isArray(shipmentIds)) {
      return res.status(400).json({
        success: false,
        message: 'Operation type and shipment IDs array are required'
      });
    }

    if (shipmentIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one shipment ID is required'
      });
    }

    let result;
    const results = {
      successful: [],
      failed: [],
      total: shipmentIds.length
    };

    switch (operation) {
      case 'update-status':
        if (!updateData.status) {
          return res.status(400).json({
            success: false,
            message: 'Status is required for bulk status update'
          });
        }
        
        for (const id of shipmentIds) {
          try {
            const filter = mongoose.Types.ObjectId.isValid(id) 
              ? { _id: id } 
              : { trackingId: id };
            
            const updated = await Shipment.findOneAndUpdate(
              filter,
              { 
                status: updateData.status,
                updatedAt: new Date()
              },
              { new: true }
            );
            
            if (updated) {
              results.successful.push({ id, trackingId: updated.trackingId });
            } else {
              results.failed.push({ id, reason: 'Shipment not found' });
            }
          } catch (error) {
            results.failed.push({ id, reason: error.message });
          }
        }
        break;
        
      case 'delete':
        for (const id of shipmentIds) {
          try {
            const filter = mongoose.Types.ObjectId.isValid(id) 
              ? { _id: id } 
              : { trackingId: id };
            
            const deleted = await Shipment.findOneAndDelete(filter);
            
            if (deleted) {
              results.successful.push({ id, trackingId: deleted.trackingId });
            } else {
              results.failed.push({ id, reason: 'Shipment not found' });
            }
          } catch (error) {
            results.failed.push({ id, reason: error.message });
          }
        }
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid operation. Supported operations: update-status, delete'
        });
    }

    res.json({
      success: true,
      data: results,
      message: `Bulk ${operation} completed. ${results.successful.length} successful, ${results.failed.length} failed.`
    });
  } catch (error) {
    console.error('Bulk operation error:', error);
    res.status(500).json({
      success: false,
      message: 'Bulk operation failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
