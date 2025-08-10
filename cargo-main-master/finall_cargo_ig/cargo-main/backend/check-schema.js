const mongoose = require('mongoose');
const Shipment = require('./models/Shipment');

mongoose.connect('mongodb://localhost:27017/cargo-capital').then(async () => {
  console.log('Connected to MongoDB');
  
  const shipments = await Shipment.find({}).select('trackingId status');
  console.log('Current shipments and their statuses:');
  shipments.forEach(s => console.log(`${s.trackingId}: '${s.status}'`));
  
  // Check the schema enum values
  const statusField = Shipment.schema.paths.status;
  console.log('\nSchema enum values:', statusField.enumValues);
  
  // Try manual update test  
  console.log('\n=== Manual Update Tests ===');
  try {
    const result = await Shipment.findOneAndUpdate(
      { trackingId: 'CC002TEST' },
      { $set: { status: 'delivered' } },
      { new: true, runValidators: true }
    );
    console.log('✅ Manual update SUCCESS:', result.trackingId, result.status);
  } catch (err) {
    console.log('❌ Manual update FAILED:', err.message);
  }
  
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
