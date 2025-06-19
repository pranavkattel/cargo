import React, { useState } from 'react';
import { Search, Package, Truck, Plane, CheckCircle, Clock, MapPin, Calendar } from 'lucide-react';

const Tracking = () => {
  const [trackingId, setTrackingId] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock tracking data
  const mockTrackingData = {
    'NC001234': {
      trackingId: 'NC001234',
      status: 'In Transit',
      origin: 'Kathmandu, Nepal',
      destination: 'New York, USA',
      estimatedDelivery: '2024-01-25',
      currentLocation: 'Dubai, UAE',
      service: 'Air Cargo Express',
      weight: '2.5 kg',
      dimensions: '30x20x15 cm',
      events: [
        {
          date: '2024-01-20',
          time: '14:30',
          location: 'Kathmandu, Nepal',
          status: 'Package Collected',
          description: 'Package collected from sender',
          icon: Package,
          completed: true
        },
        {
          date: '2024-01-21',
          time: '08:45',
          location: 'Kathmandu Airport, Nepal',
          status: 'Customs Cleared',
          description: 'Package cleared customs and ready for export',
          icon: CheckCircle,
          completed: true
        },
        {
          date: '2024-01-21',
          time: '22:15',
          location: 'Dubai, UAE',
          status: 'In Transit',
          description: 'Package arrived at transit hub',
          icon: Plane,
          completed: true
        },
        {
          date: '2024-01-23',
          time: '16:00',
          location: 'Dubai, UAE',
          status: 'Processing',
          description: 'Package being processed for onward journey',
          icon: Clock,
          completed: false
        },
        {
          date: '2024-01-24',
          time: 'Estimated',
          location: 'New York, USA',
          status: 'Out for Delivery',
          description: 'Package will be out for delivery',
          icon: Truck,
          completed: false
        },
        {
          date: '2024-01-25',
          time: 'Estimated',
          location: 'New York, USA',
          status: 'Delivered',
          description: 'Package delivered to recipient',
          icon: CheckCircle,
          completed: false
        }
      ]
    },
    'NC005678': {
      trackingId: 'NC005678',
      status: 'Delivered',
      origin: 'Kathmandu, Nepal',
      destination: 'London, UK',
      estimatedDelivery: '2024-01-18',
      currentLocation: 'London, UK',
      service: 'Sea Freight',
      weight: '15 kg',
      dimensions: '50x40x30 cm',
      events: [
        {
          date: '2024-01-10',
          time: '10:00',
          location: 'Kathmandu, Nepal',
          status: 'Package Collected',
          description: 'Package collected from sender',
          icon: Package,
          completed: true
        },
        {
          date: '2024-01-12',
          time: '14:20',
          location: 'Kolkata Port, India',
          status: 'Shipped',
          description: 'Package shipped via sea freight',
          icon: Plane,
          completed: true
        },
        {
          date: '2024-01-18',
          time: '09:30',
          location: 'London, UK',
          status: 'Delivered',
          description: 'Package delivered successfully',
          icon: CheckCircle,
          completed: true
        }
      ]
    }
  };

  const handleTrack = async () => {
    if (!trackingId.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const result = mockTrackingData[trackingId as keyof typeof mockTrackingData];
      setTrackingResult(result || null);
      setIsLoading(false);
    }, 1500);
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

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-20" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Track Your Cargo
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Enter your tracking number to get real-time updates on your shipment's location and delivery status.
            </p>
          </div>
        </div>
      </section>

      {/* Tracking Form */}
      <section className="py-16" style={{ backgroundColor: '#f6f6f6' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-8">
              <Package className="h-12 w-12 mx-auto mb-4" style={{ color: '#f9b222' }} />
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#1a1a1a' }}>Enter Tracking Number</h2>
              <p className="text-gray-600">Your tracking number can be found in your shipping confirmation email</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter your tracking ID (e.g., NC001234)"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-2 text-lg"
                  style={{ 
                    focusRingColor: '#f9b222',
                    focusBorderColor: '#f9b222'
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
                />
              </div>
              <button
                onClick={handleTrack}
                disabled={isLoading || !trackingId.trim()}
                className="text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 disabled:bg-gray-400"
                style={{ 
                  backgroundColor: isLoading || !trackingId.trim() ? '#9ca3af' : '#f9b222',
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && trackingId.trim()) {
                    e.currentTarget.style.backgroundColor = '#e6a01e';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading && trackingId.trim()) {
                    e.currentTarget.style.backgroundColor = '#f9b222';
                  }
                }}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    <span>Track</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Try these sample tracking numbers: <strong>NC001234</strong> or <strong>NC005678</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tracking Results */}
      {trackingResult && (
        <section className="py-16" style={{ backgroundColor: '#f6f6f6' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Shipment Summary */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2" style={{ color: '#1a1a1a' }}>
                    Tracking ID: {trackingResult.trackingId}
                  </h2>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trackingResult.status)}`}>
                    <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                    {trackingResult.status}
                  </div>
                </div>
                <div className="mt-4 lg:mt-0 text-right">
                  <p className="text-sm text-gray-500">Service Type</p>
                  <p className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>{trackingResult.service}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5" style={{ color: '#f9b222' }} />
                  <div>
                    <p className="text-sm text-gray-500">From</p>
                    <p className="font-semibold" style={{ color: '#1a1a1a' }}>{trackingResult.origin}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5" style={{ color: '#f9b222' }} />
                  <div>
                    <p className="text-sm text-gray-500">To</p>
                    <p className="font-semibold" style={{ color: '#1a1a1a' }}>{trackingResult.destination}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5" style={{ color: '#f9b222' }} />
                  <div>
                    <p className="text-sm text-gray-500">Expected Delivery</p>
                    <p className="font-semibold" style={{ color: '#1a1a1a' }}>{trackingResult.estimatedDelivery}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5" style={{ color: '#f9b222' }} />
                  <div>
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="font-semibold" style={{ color: '#1a1a1a' }}>{trackingResult.weight}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold mb-6" style={{ color: '#1a1a1a' }}>Shipment Timeline</h3>
              
              <div className="relative">
                <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200"></div>
                
                <div className="space-y-6">
                  {trackingResult.events.map((event: any, index: number) => {
                    const IconComponent = event.icon;
                    return (
                      <div key={index} className="relative flex items-start space-x-4">
                        <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${
                          event.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <h4 className={`text-lg font-semibold ${
                                event.completed ? 'text-gray-900' : 'text-gray-500'
                              }`}>
                                {event.status}
                              </h4>
                              <p className={`text-sm ${
                                event.completed ? 'text-gray-600' : 'text-gray-400'
                              }`}>
                                {event.description}
                              </p>
                              <p className={`text-sm font-medium ${
                                event.completed ? 'text-blue-600' : 'text-gray-400'
                              }`}>
                                {event.location}
                              </p>
                            </div>
                            <div className="mt-2 sm:mt-0 text-right">
                              <p className={`text-sm ${
                                event.completed ? 'text-gray-600' : 'text-gray-400'
                              }`}>
                                {event.date}
                              </p>
                              <p className={`text-sm ${
                                event.completed ? 'text-gray-600' : 'text-gray-400'
                              }`}>
                                {event.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {trackingResult === null && trackingId && !isLoading && (
        <section className="py-16" style={{ backgroundColor: '#f6f6f6' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="mb-4" style={{ color: '#f9b222' }}>
                <Package className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#1a1a1a' }}>Tracking Number Not Found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find a shipment with tracking number "{trackingId}". 
                Please check your tracking number and try again.
              </p>
              <p className="text-sm text-gray-500">
                If you continue to have issues, please contact our customer service at +977-1-4444-555
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Help Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#1a1a1a' }}>Need Help with Tracking?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Common questions about tracking your shipment
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="rounded-xl p-6" style={{ backgroundColor: '#f6f6f6' }}>
              <h3 className="text-lg font-semibold mb-3" style={{ color: '#1a1a1a' }}>Where is my tracking number?</h3>
              <p className="text-gray-600 text-sm">
                Your tracking number is provided in the confirmation email sent when your shipment is processed. 
                It usually starts with "NC" followed by 6 digits.
              </p>
            </div>
            
            <div className="rounded-xl p-6" style={{ backgroundColor: '#f6f6f6' }}>
              <h3 className="text-lg font-semibold mb-3" style={{ color: '#1a1a1a' }}>Why isn't my tracking updating?</h3>
              <p className="text-gray-600 text-sm">
                Tracking information may take 24-48 hours to appear in the system. 
                For international shipments, updates may be less frequent during transit.
              </p>
            </div>
            
            <div className="rounded-xl p-6" style={{ backgroundColor: '#f6f6f6' }}>
              <h3 className="text-lg font-semibold mb-3" style={{ color: '#1a1a1a' }}>My package is delayed</h3>
              <p className="text-gray-600 text-sm">
                Delays can occur due to customs processing, weather, or other factors. 
                Contact our support team if your package is significantly delayed.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tracking;