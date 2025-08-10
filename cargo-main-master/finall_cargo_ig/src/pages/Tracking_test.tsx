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

  return (
    <div className="pt-16">
      <section className="text-white py-20" style={{ background: 'linear-gradient(to right, #0096C7, #007bb3)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Track Your Cargo
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Enter your tracking number to get real-time updates on your shipment's journey
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tracking;
