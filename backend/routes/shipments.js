const express = require('express');
const router = express.Router();
const Shipment = require('../models/Shipment');

// Get all shipments with pagination
router.get('/shipments', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const search = req.query.search;

    // Build query
    let query = {};
    if (status) {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { trackingId: { $regex: search, $options: 'i' } },
        { 'customerInfo.name': { $regex: search, $options: 'i' } },
        { 'customerInfo.email': { $regex: search, $options: 'i' } }
      ];
    }

    const shipments = await Shipment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Shipment.countDocuments(query);

    res.json({
      success: true,
      data: shipments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
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
    
    // Validate required fields
    const requiredFields = ['customerInfo', 'shipmentDetails', 'estimatedDelivery'];
    for (const field of requiredFields) {
      if (!shipmentData[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }

    // Create initial tracking event
    const initialEvent = {
      status: 'processing',
      description: 'Shipment received and processing has begun',
      location: shipmentData.shipmentDetails.origin,
      timestamp: new Date(),
      completed: false
    };

    const shipment = new Shipment({
      ...shipmentData,
      status: 'processing',
      events: [initialEvent]
    });

    await shipment.save();

    res.status(201).json({
      success: true,
      data: shipment,
      message: 'Shipment created successfully'
    });
  } catch (error) {
    console.error('Create shipment error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Tracking ID already exists'
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create shipment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update shipment by ID or tracking ID
router.put('/shipments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Try to find by MongoDB ObjectId first, then by trackingId
    let shipment;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // Valid ObjectId format
      shipment = await Shipment.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
    } else {
      // Assume it's a tracking ID
      shipment = await Shipment.findOneAndUpdate(
        { trackingId: id },
        updateData,
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
      message: 'Shipment updated successfully'
    });
  } catch (error) {
    console.error('Update shipment error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

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

    // Try to find by MongoDB ObjectId first, then by trackingId
    let shipment;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // Valid ObjectId format
      shipment = await Shipment.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      );
    } else {
      // Assume it's a tracking ID
      shipment = await Shipment.findOneAndUpdate(
        { trackingId: id },
        { status },
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
      message: 'Shipment status updated successfully'
    });
  } catch (error) {
    console.error('Update shipment status error:', error);
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

    await shipment.addTrackingEvent(status, description, location);

    res.json({
      success: true,
      data: shipment,
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
    
    // Try to find by MongoDB ObjectId first, then by trackingId
    let shipment;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // Valid ObjectId format
      shipment = await Shipment.findByIdAndDelete(id);
    } else {
      // Assume it's a tracking ID
      shipment = await Shipment.findOneAndDelete({ trackingId: id });
    }

    if (!shipment) {
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

// Get available delivery status options (for dropdown)
router.get('/delivery-status-options', (req, res) => {
  const statusOptions = [
    { value: 'processing', label: 'Processing', description: 'Order is being processed' },
    { value: 'picked-up', label: 'Picked Up', description: 'Package picked up by carrier' },
    { value: 'in-transit', label: 'In Transit', description: 'Package is on the way' },
    { value: 'out-for-delivery', label: 'Out for Delivery', description: 'Package is out for delivery' },
    { value: 'delivered', label: 'Delivered', description: 'Package delivered successfully' },
    { value: 'failed-delivery', label: 'Failed Delivery', description: 'Delivery attempt failed' },
    { value: 'returned', label: 'Returned', description: 'Package returned to sender' },
    { value: 'cancelled', label: 'Cancelled', description: 'Shipment cancelled' }
  ];

  res.json({
    success: true,
    data: statusOptions,
    message: 'Available delivery status options'
  });
});

module.exports = router;
