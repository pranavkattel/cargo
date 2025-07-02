import React, { useState, useEffect } from 'react';

const TestAPI: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<string>('Testing...');
  const [shipments, setShipments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    const testAPI = async () => {
      addLog('Starting API test...');
      setApiStatus('Testing API...');

      try {
        // Test environment variables
        addLog(`Environment VITE_API_URL: ${import.meta.env.VITE_API_URL}`);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        addLog(`Using API URL: ${apiUrl}`);

        // Test 1: Health check
        addLog('Testing API health endpoint...');
        const healthResponse = await fetch(`${apiUrl}/health`);
        addLog(`Health response status: ${healthResponse.status}`);
        
        if (!healthResponse.ok) {
          throw new Error(`Health check failed: ${healthResponse.status}`);
        }

        const healthData = await healthResponse.json();
        addLog(`Health response: ${JSON.stringify(healthData)}`);

        // Test 2: Get shipments
        addLog('Testing shipments endpoint...');
        const shipmentsResponse = await fetch(`${apiUrl}/shipments?page=1&limit=10`);
        addLog(`Shipments response status: ${shipmentsResponse.status}`);
        
        if (!shipmentsResponse.ok) {
          throw new Error(`Shipments request failed: ${shipmentsResponse.status}`);
        }

        const shipmentsData = await shipmentsResponse.json();
        addLog(`Shipments response: ${JSON.stringify(shipmentsData, null, 2)}`);

        if (shipmentsData.success && shipmentsData.data) {
          setShipments(shipmentsData.data);
          setApiStatus(`✅ SUCCESS! Found ${shipmentsData.data.length} shipments`);
          addLog(`Successfully loaded ${shipmentsData.data.length} shipments`);
        } else {
          setError('API responded but no data found');
          addLog('API responded but no data found');
        }
      } catch (err: any) {
        addLog(`❌ ERROR: ${err.message}`);
        setError(`API Error: ${err.message}`);
        setApiStatus('❌ API Failed');
      }
    };

    testAPI();
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🔧 API Connection Test</h1>
      
      <div className="mb-4 p-4 bg-blue-100 rounded">
        <h2 className="font-bold text-lg mb-2">Current Status:</h2>
        <p className={`text-lg ${error ? 'text-red-600' : 'text-green-600'}`}>
          {apiStatus}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 rounded">
          <h2 className="font-bold text-lg mb-2 text-red-600">Error Details:</h2>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h2 className="font-bold text-lg mb-2">Debug Logs:</h2>
        <div className="text-sm font-mono space-y-1 max-h-40 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="break-all">{log}</div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Shipments from API ({shipments.length}):</h2>
        
        {shipments.length > 0 ? (
          <div className="space-y-4">
            {shipments.map((shipment, index) => (
              <div key={index} className="border p-4 rounded bg-white shadow">
                <h3 className="font-bold text-lg text-green-600">{shipment.trackingId}</h3>
                <p><strong>Customer:</strong> {shipment.customerInfo?.name}</p>
                <p><strong>Status:</strong> <span className="font-semibold">{shipment.status}</span></p>
                <p><strong>Route:</strong> {shipment.shipmentDetails?.origin} → {shipment.shipmentDetails?.destination}</p>
                <p><strong>Created:</strong> {new Date(shipment.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No shipments loaded yet...</p>
        )}
      </div>

      <div className="mt-8 p-4 bg-yellow-100 rounded">
        <h2 className="text-xl font-semibold mb-2">Quick Tests:</h2>
        <div className="space-y-2">
          <div>
            <strong>Backend Health:</strong> 
            <a href="http://localhost:5000/api/health" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-2">
              Test in new tab
            </a>
          </div>
          <div>
            <strong>All Shipments:</strong> 
            <a href="http://localhost:5000/api/shipments" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-2">
              Test in new tab
            </a>
          </div>
          <div>
            <strong>Track Sample:</strong> 
            <a href="http://localhost:5000/api/track/CC001TEST" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-2">
              Test in new tab
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAPI;
