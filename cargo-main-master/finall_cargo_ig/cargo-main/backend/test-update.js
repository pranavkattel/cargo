const mongoose = require('mongoose');
const Shipment = require('./models/Shipment');

mongoose.connect('mongodb://localhost:27017/cargo-capital').then(async () => {
  console.log('Connected to MongoDB');
  
  // Check schema enum values
  const statusField = Shipment.schema.paths.status;
  console.log('Schema enum values:', statusField.enumValues);
  
  // Try to update a specific shipment
  const trackingId = 'CC223434O1J';
  console.log(`\nTrying to update ${trackingId} to 'picked-up'...`);
  
  try {
    const result = await Shipment.findOneAndUpdate(
      { trackingId: trackingId },
      { $set: { status: 'picked-up' } },
      { 
        new: true,
        runValidators: true 
      }
    );
    console.log('✅ Update successful:', result.trackingId, result.status);
  } catch (error) {
    console.log('❌ Update failed:', error.message);
    
    // Try without validation
    console.log('Trying without validation...');
    try {
      const result2 = await Shipment.findOneAndUpdate(
        { trackingId: trackingId },
        { $set: { status: 'picked-up' } },
        { 
          new: true,
          runValidators: false 
        }
      );
      console.log('✅ Update without validation successful:', result2.trackingId, result2.status);
    } catch (error2) {
      console.log('❌ Update without validation also failed:', error2.message);
    }
  }
  
  process.exit(0);
}).catch(err => {
  console.error('Connection error:', err);
  process.exit(1);
});
