// Quick test script to verify API data transformation
async function testTracking() {
  try {
    const response = await fetch('http://localhost:5000/api/track/CC001234567');
    const data = await response.json();
    
    console.log('=== RAW API RESPONSE ===');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.success && data.data) {
      // Simulate the transformation that happens in trackingService.ts
      const backendData = data.data;
      
      const transformedData = {
        _id: backendData.id,
        trackingId: backendData.trackingId,
        customerInfo: backendData.customerInfo,
        shipmentDetails: backendData.shipmentDetails,
        status: backendData.status,
        events: backendData.trackingEvents || [], // Map trackingEvents to events
        estimatedDelivery: backendData.shipmentDetails?.estimatedDelivery || backendData.estimatedDelivery || '',
        createdAt: backendData.createdAt,
        updatedAt: backendData.updatedAt
      };
      
      console.log('=== TRANSFORMED DATA FOR FRONTEND ===');
      console.log(JSON.stringify(transformedData, null, 2));
      
      console.log('=== VALIDATION ===');
      console.log('Has events array:', Array.isArray(transformedData.events));
      console.log('Events count:', transformedData.events.length);
      console.log('Has estimatedDelivery:', !!transformedData.estimatedDelivery);
      console.log('Has customerInfo:', !!transformedData.customerInfo);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testTracking();
