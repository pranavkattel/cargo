import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, MapPin, Calendar } from 'lucide-react';
import trackingService, { ShipmentData } from '../services/trackingService';

const Tracking: React.FC = () => {
  const [trackingId, setTrackingId] = useState('');
  const [trackingResult, setTrackingResult] = useState<ShipmentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async () => {
    if (!trackingId.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to get from database first
      let result = await trackingService.trackShipment(trackingId.trim());
      
      // If not found in database, try mock data for development
      if (!result) {
        result = trackingService.generateMockTrackingData(trackingId.trim());
      }
      
      setTrackingResult(result);
      
      if (!result) {
        setError('Tracking number not found. Please check your tracking ID and try again.');
      }
    } catch (error) {
      console.error('Tracking error:', error);
      setError('Failed to track shipment. Please try again later.');
      setTrackingResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-50';
      case 'in transit': return 'text-blue-600 bg-blue-50';
      case 'processing': return 'text-yellow-600 bg-yellow-50';
      case 'out for delivery': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="text-white py-20" style={{ background: 'linear-gradient(to right, #0096C7, #007bb3)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Track Your Cargo
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Enter your tracking number to get real-time updates on your shipment's location and delivery status.
            </p>
          </div>
        </div>
      </section>

      {/* Tracking Form */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter your tracking number (e.g., DEMO123)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
                />
              </div>
              <button
                onClick={handleTrack}
                disabled={isLoading || !trackingId.trim()}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-lg font-medium"
                style={{ backgroundColor: '#0096C7' }}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Tracking...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    <span>Track Shipment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Tracking Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tracking Results */}
      {trackingResult && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: '#0096C7' }}>
                      Tracking ID: {trackingResult.trackingId}
                    </h2>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trackingResult.status)}`}>
                      <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                      {trackingResult.status}
                    </div>
                  </div>
                  <div className="mt-4 lg:mt-0 text-right">
                    <p className="text-sm text-gray-500">Service Type</p>
                    <p className="text-lg font-semibold" style={{ color: '#0096C7' }}>{trackingResult.shipmentDetails.serviceType}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5" style={{ color: '#F9B222' }} />
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="font-semibold">{trackingResult.shipmentDetails.origin}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5" style={{ color: '#F9B222' }} />
                    <div>
                      <p className="text-sm text-gray-500">To</p>
                      <p className="font-semibold">{trackingResult.shipmentDetails.destination}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Package className="h-5 w-5" style={{ color: '#F9B222' }} />
                    <div>
                      <p className="text-sm text-gray-500">Weight</p>
                      <p className="font-semibold">{trackingResult.shipmentDetails.weight} kg</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5" style={{ color: '#F9B222' }} />
                    <div>
                      <p className="text-sm text-gray-500">Est. Delivery</p>
                      <p className="font-semibold">{formatDate(trackingResult.estimatedDelivery)}</p>
                    </div>
                  </div>
                </div>
                {/* Customer Information */}
                <div className="border-t border-gray-200 pt-6 mb-8">
                  <h3 className="text-lg font-semibold mb-4" style={{ color: '#0096C7' }}>Shipment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Customer Information</h4>
                      <p className="text-gray-700">{trackingResult.customerInfo.name}</p>
                      <p className="text-gray-600 text-sm">{trackingResult.customerInfo.email}</p>
                      <p className="text-gray-600 text-sm">{trackingResult.customerInfo.phone}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Package Description</h4>
                      <p className="text-gray-700">{trackingResult.shipmentDetails.description}</p>
                      <p className="text-gray-600 text-sm">Service: {trackingResult.shipmentDetails.serviceType}</p>
                    </div>
                  </div>
                </div>
                {/* Tracking Timeline */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold mb-6" style={{ color: '#0096C7' }}>Tracking History</h3>
                  <div className="space-y-6">
                    {trackingResult.events.map((event, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          event.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {event.completed ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Clock className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">{event.status}</p>
                            <p className="text-sm text-gray-500">{formatDate(event.timestamp)}</p>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{event.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Help Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8" style={{ color: '#0096C7' }}>
              Need Help with Tracking?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F9B222' }}>
                  <Package className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Track Multiple Packages</h3>
                <p className="text-gray-600 text-sm">
                  Enter multiple tracking numbers separated by commas to track several shipments at once.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F9B222' }}>
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Real-time Updates</h3>
                <p className="text-gray-600 text-sm">
                  Get real-time notifications and updates about your shipment's progress via email or SMS.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F9B222' }}>
                  <Truck className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Delivery Information</h3>
                <p className="text-gray-600 text-sm">
                  Delays can occur due to customs processing, weather, or other factors. 
                  Contact our support team if your package is significantly delayed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tracking;
