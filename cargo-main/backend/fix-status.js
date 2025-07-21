const mongoose = require('mongoose');
const Shipment = require('./models/Shipment');

mongoose.connect('mongodb://localhost:27017/cargo-capital').then(async () => {
  console.log('Connected to MongoDB');
  
  // Fix the status format in existing records
  console.log('Fixing status formats...');
  
  const statusMapping = {
    'Processing': 'processing',
    'In Transit': 'in-transit',
    'Delivered': 'delivered',
    'Picked Up': 'picked-up',
    'Out for Delivery': 'out-for-delivery',
    'Failed Delivery': 'failed-delivery',
    'Returned': 'returned',
    'Cancelled': 'cancelled'
  };
  
  const shipments = await Shipment.find({});
  console.log(`Found ${shipments.length} shipments to check`);
  
  for (const shipment of shipments) {
    const oldStatus = shipment.status;
    const newStatus = statusMapping[oldStatus] || oldStatus.toLowerCase().replace(/ /g, '-');
    
    if (oldStatus !== newStatus) {
      console.log(`Updating ${shipment.trackingId}: '${oldStatus}' -> '${newStatus}'`);
      await Shipment.updateOne(
        { _id: shipment._id },
        { $set: { status: newStatus } },
        { runValidators: false } // Skip validation during fix
      );
    }
  }
  
  console.log('Status format fix completed!');
  
  // Show final status
  const updatedShipments = await Shipment.find({}).select('trackingId status');
  console.log('\nUpdated shipments:');
  updatedShipments.forEach(s => console.log(`${s.trackingId}: '${s.status}'`));
  
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
