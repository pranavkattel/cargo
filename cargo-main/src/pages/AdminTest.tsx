import React, { useEffect, useState } from 'react';

const AdminTest: React.FC = () => {
  const [status, setStatus] = useState('Loading...');
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    console.log('AdminTest: Starting API test...');
    setStatus('Testing API...');

    const testAPI = async () => {
      try {
        console.log('AdminTest: Making API call...');
        const response = await fetch('http://localhost:5000/api/shipments');
        console.log('AdminTest: Got response:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('AdminTest: Parsed JSON:', result);

        if (result.success && result.data) {
          setData(result.data);
          setStatus(`Success! Found ${result.data.length} shipments`);
        } else {
          setStatus('API returned no data');
        }
      } catch (error: any) {
        console.error('AdminTest: API Error:', error);
        setStatus(`Error: ${error.message}`);
      }
    };

    testAPI();
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Test</h1>
      
      <div className="bg-yellow-100 p-4 mb-6 rounded">
        <h2 className="font-bold text-lg mb-2">Status:</h2>
        <p>{status}</p>
      </div>

      {data.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Shipments ({data.length}):</h2>
          <div className="space-y-4">
            {data.map((shipment, index) => (
              <div key={index} className="border p-4 rounded bg-white">
                <h3 className="font-bold">{shipment.trackingId}</h3>
                <p>Customer: {shipment.customerInfo?.name}</p>
                <p>Status: {shipment.status}</p>
                <p>From: {shipment.shipmentDetails?.origin} → To: {shipment.shipmentDetails?.destination}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTest;
