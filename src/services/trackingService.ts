// API Configuration with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 
                    (import.meta.env.PROD ? 'https://your-backend-domain.com/api' : 'http://localhost:5000/api');

console.log('🌐 API Configuration:');
console.log('Environment mode:', import.meta.env.MODE);
console.log('Is production:', import.meta.env.PROD);
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('Final API_BASE_URL:', API_BASE_URL);

export interface TrackingEvent {
  status: string;
  description: string;
  location: string;
  timestamp: string;
  completed: boolean;
  _id?: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface ShipmentDetails {
  origin: string;
  destination: string;
  weight: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  serviceType: string;
  description: string;
  value?: number;
}

export interface ShipmentData {
  _id?: string;
  trackingId: string;
  customerInfo: CustomerInfo;
  shipmentDetails: ShipmentDetails;
  status: string;
  events: TrackingEvent[];
  estimatedDelivery: string;
  actualDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class TrackingService {
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    console.log('Making API request to:', fullUrl);
    
    try {
      const response = await fetch(fullUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      console.log('API response status:', response.status);
      console.log('API response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();
      console.log('API response data:', jsonData);
      return jsonData;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async trackShipment(trackingId: string): Promise<ShipmentData | null> {
    try {
      const response = await this.makeRequest<ShipmentData>(`/track/${trackingId}`);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        return null;
      }
    } catch (error: any) {
      console.error('Tracking error:', error);
      
      // If it's a network error or 503 (database not available), return null to trigger fallback
      if (error.message?.includes('503') || error.message?.includes('fetch')) {
        console.log('Backend not available, will use mock data fallback');
        return null;
      }
      
      // For other errors, still return null to trigger mock data fallback
      return null;
    }
  }
  
  async createShipment(shipmentData: Omit<ShipmentData, '_id' | 'trackingId' | 'createdAt' | 'updatedAt'>): Promise<ShipmentData> {
    try {
      const response = await this.makeRequest<ShipmentData>('/shipments', {
        method: 'POST',
        body: JSON.stringify(shipmentData),
      });
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create shipment');
      }
    } catch (error) {
      console.error('Create shipment error:', error);
      throw error;
    }
  }
  
  async updateShipmentStatus(
    trackingId: string, 
    status: string, 
    description: string, 
    location: string
  ): Promise<ShipmentData> {
    try {
      const response = await this.makeRequest<ShipmentData>(`/shipments/${trackingId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, description, location }),
      });
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Update status error:', error);
      throw error;
    }
  }

  async getAllShipments(page: number = 1, limit: number = 10, status?: string): Promise<ApiResponse<ShipmentData[]>> {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status }),
      });

      return await this.makeRequest<ShipmentData[]>(`/shipments?${queryParams}`);
    } catch (error) {
      console.error('Get shipments error:', error);
      throw error;
    }
  }

  // Generate mock data for development/testing
  generateMockTrackingData(trackingId: string): ShipmentData | null {
    const mockData: Record<string, ShipmentData> = {
      'CC001234': {
        trackingId: 'CC001234',
        customerInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+977-98xxxxxxxx',
          address: 'Kathmandu, Nepal'
        },
        shipmentDetails: {
          origin: 'Kathmandu, Nepal',
          destination: 'New York, USA',
          weight: 2.5,
          serviceType: 'Air Cargo Express',
          description: 'Documents and handicrafts',
          value: 150
        },
        status: 'In Transit',
        events: [
          {
            status: 'Package Collected',
            description: 'Package collected from sender',
            location: 'Kathmandu, Nepal',
            timestamp: '2024-01-20T14:30:00Z',
            completed: true
          },
          {
            status: 'Customs Cleared',
            description: 'Package cleared customs and ready for export',
            location: 'Kathmandu Airport, Nepal',
            timestamp: '2024-01-21T08:45:00Z',
            completed: true
          },
          {
            status: 'In Transit',
            description: 'Package arrived at transit hub',
            location: 'Dubai, UAE',
            timestamp: '2024-01-21T22:15:00Z',
            completed: true
          },
          {
            status: 'Out for Delivery',
            description: 'Package out for final delivery',
            location: 'New York, USA',
            timestamp: '2024-01-25T10:00:00Z',
            completed: false
          }
        ],
        estimatedDelivery: '2024-01-25T18:00:00Z',
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-01-21T22:15:00Z'
      },
      'CC005678': {
        trackingId: 'CC005678',
        customerInfo: {
          name: 'Sarah Wilson',
          email: 'sarah@example.com',
          phone: '+44-7xxxxxxxxx',
          address: 'London, UK'
        },
        shipmentDetails: {
          origin: 'Kathmandu, Nepal',
          destination: 'London, UK',
          weight: 5.2,
          serviceType: 'Sea Freight',
          description: 'Traditional carpets',
          value: 800
        },
        status: 'Delivered',
        events: [
          {
            status: 'Package Collected',
            description: 'Package collected from sender',
            location: 'Kathmandu, Nepal',
            timestamp: '2024-01-10T09:00:00Z',
            completed: true
          },
          {
            status: 'Shipped',
            description: 'Package loaded onto cargo vessel',
            location: 'Kolkata Port, India',
            timestamp: '2024-01-15T16:30:00Z',
            completed: true
          },
          {
            status: 'In Transit',
            description: 'Package in transit via sea route',
            location: 'Arabian Sea',
            timestamp: '2024-01-20T12:00:00Z',
            completed: true
          },
          {
            status: 'Delivered',
            description: 'Package successfully delivered',
            location: 'London, UK',
            timestamp: '2024-02-01T14:20:00Z',
            completed: true
          }
        ],
        estimatedDelivery: '2024-02-01T18:00:00Z',
        actualDelivery: '2024-02-01T14:20:00Z',
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-02-01T14:20:00Z'
      },
      'DEMO123': {
        trackingId: 'DEMO123',
        customerInfo: {
          name: 'Demo User',
          email: 'demo@example.com',
          phone: '+1-555-0000',
          address: 'Demo City, USA'
        },
        shipmentDetails: {
          origin: 'New York, USA',
          destination: 'Kathmandu, Nepal',
          weight: 10,
          serviceType: 'Express',
          description: 'Demo Electronics',
          value: 500
        },
        status: 'In Transit',
        events: [
          {
            status: 'Shipped',
            description: 'Shipment picked up from sender.',
            location: 'New York, USA',
            timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            completed: true
          },
          {
            status: 'In Transit',
            description: 'Shipment is on the way.',
            location: 'Dubai, UAE',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            completed: false
          }
        ],
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      'TEST456': {
        trackingId: 'TEST456',
        customerInfo: {
          name: 'Test User',
          email: 'test@example.com',
          phone: '+1-555-1111',
          address: 'Test City, USA'
        },
        shipmentDetails: {
          origin: 'Los Angeles, USA',
          destination: 'London, UK',
          weight: 5,
          serviceType: 'Standard',
          description: 'Test Books',
          value: 200
        },
        status: 'Delivered',
        events: [
          {
            status: 'Shipped',
            description: 'Shipment picked up from sender.',
            location: 'Los Angeles, USA',
            timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            completed: true
          },
          {
            status: 'Delivered',
            description: 'Shipment delivered to recipient.',
            location: 'London, UK',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            completed: true
          }
        ],
        estimatedDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    };

    return mockData[trackingId] || null;
  }
}

export default new TrackingService();
