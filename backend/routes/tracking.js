const express = require('express');
const router = express.Router();
const Shipment = require('../models/Shipment');

// Track shipment by tracking ID
router.get('/track/:trackingId', async (req, res) => {
  try {
    const { trackingId } = req.params;
    
    if (!trackingId) {
      return res.status(400).json({
        success: false,
        message: 'Tracking ID is required'
      });
    }

    // Check if MongoDB is connected
    if (!req.mongoConnected) {
      return res.status(503).json({
        success: false,
        message: 'Database not available. Please try again later.',
        fallback: true
      });
    }

    const shipment = await Shipment.findOne({ 
      trackingId: trackingId.toUpperCase() 
    });

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
    console.error('Tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track shipment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get multiple shipments by tracking IDs
router.post('/track/batch', async (req, res) => {
  try {
    const { trackingIds } = req.body;
    
    if (!trackingIds || !Array.isArray(trackingIds)) {
      return res.status(400).json({
        success: false,
        message: 'trackingIds array is required'
      });
    }

    const shipments = await Shipment.find({ 
      trackingId: { $in: trackingIds.map(id => id.toUpperCase()) }
    });

    res.json({
      success: true,
      data: shipments
    });
  } catch (error) {
    console.error('Batch tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track shipments',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
