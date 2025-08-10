// API Configuration with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 
                    (import.meta.env.PROD ? 'https://your-backend-domain.com/api' : 'http://localhost:5000/api');

console.log('🌐 API Configuration:');
console.log('Environment mode:', import.meta.env.MODE);
console.log('Is production:', import.meta.env.PROD);
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('Final API_BASE_URL:', API_BASE_URL);

// Dropdown option interfaces
export interface DropdownOption {
  value: string;
  label: string;
  description?: string;
  color?: string;
  icon?: string;
  price?: string;
  estimatedDays?: number;
  popular?: boolean;
  region?: string;
  code?: string;
}

export interface ServiceRecommendation extends DropdownOption {
  recommendationScore: number;
  reasons: string[];
  recommended: boolean;
  rank: number;
  confidence: 'high' | 'medium' | 'low';
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  suggestions: string[];
  validationScore: number;
  formattedAddress?: string;
  formattedTrackingId?: string;
  addressComponents?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface ShipmentStatistics {
  summary: {
    totalShipments: number;
    deliveredShipments: number;
    inTransitShipments: number;
    processingShipments: number;
    activeShipments: number;
    deliveryRate: number;
  };
  breakdowns: {
    status: Array<{ _id: string; count: number }>;
    serviceType: Array<{ _id: string; count: number }>;
  };
  metrics: {
    timeframe: string;
    generatedAt: string;
    performanceScore: string;
  };
}

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

// Admin authentication interfaces
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  lastLogin?: Date;
  createdAt?: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    admin: AdminUser;
  };
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Backend expects these exact status values:
// 'processing', 'picked-up', 'in-transit', 'out-for-delivery', 'delivered', 'failed-delivery', 'returned', 'cancelled'
const backendStatusMap: Record<string, string> = {
  'processing': 'processing',
  'picked-up': 'picked-up',
  'in-transit': 'in-transit',
  'out-for-delivery': 'out-for-delivery',
  'delivered': 'delivered',
  'failed-delivery': 'failed-delivery',
  'returned': 'returned',
  'cancelled': 'cancelled',
};
function backendStatusFromFrontend(status: string): string {
  return backendStatusMap[status] || status;
}

// Move normalizeStatus definition above updateShipmentStatus
const statusMap: Record<string, string> = {
  "Processing": "processing",
  "In Transit": "in-transit",
  "Out for Delivery": "out-for-delivery",
  "Delivered": "delivered",
  "Cancelled": "cancelled",
  "Failed Delivery": "cancelled",
  "Returned": "cancelled",
  // Add more mappings as needed
};
function normalizeStatus(status: string): string {
  return statusMap[status] || status?.toLowerCase().replace(/ /g, '-') || 'processing';
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
      const response = await this.makeRequest<any>(`/track/${trackingId}`);
      
      if (response.success && response.data) {
        // Transform backend data structure to match frontend expectations
        const backendData = response.data;
        
        const transformedData: ShipmentData = {
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
        
        return transformedData;
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
      const backendStatus = backendStatusFromFrontend(status);
      const response = await this.makeRequest<ShipmentData>(`/shipments/${trackingId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: backendStatus, description, location }),
      });
      
      if (response.success && response.data) {
        response.data.status = normalizeStatus(response.data.status);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Update status error:', error);
      throw error;
    }
  }

  // Update complete shipment data
  async updateShipment(trackingId: string, shipmentData: Partial<ShipmentData>): Promise<ShipmentData> {
    try {
      const response = await this.makeRequest<ShipmentData>(`/shipments/${trackingId}`, {
        method: 'PUT',
        body: JSON.stringify(shipmentData),
      });
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update shipment');
      }
    } catch (error) {
      console.error('Update shipment error:', error);
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

  async deleteShipment(trackingId: string): Promise<void> {
    try {
      const response = await this.makeRequest(`/shipments/${trackingId}`, {
        method: 'DELETE',
      });
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete shipment');
      }
    } catch (error) {
      console.error('Delete shipment error:', error);
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

// Dropdown and validation API functions
export const trackingAPI = {
  // Existing shipment CRUD operations
  trackShipment: async (trackingId: string): Promise<ShipmentData | null> => {
    try {
      const response = await new TrackingService().trackShipment(trackingId);
      
      if (response) {
        return response;
      } else {
        // Fallback to mock data if tracking not found
        console.log('Tracking not found, using mock data');
        return new TrackingService().generateMockTrackingData(trackingId);
      }
    } catch (error) {
      console.error('Error tracking shipment:', error);
      throw error;
    }
  },
  
  createShipment: async (shipmentData: Omit<ShipmentData, '_id' | 'trackingId' | 'createdAt' | 'updatedAt'>): Promise<ShipmentData> => {
    return await new TrackingService().createShipment(shipmentData);
  },
  
  updateShipmentStatus: async (
    trackingId: string, 
    status: string, 
    description: string, 
    location: string
  ): Promise<ShipmentData> => {
    return await new TrackingService().updateShipmentStatus(trackingId, status, description, location);
  },

  getAllShipments: async (page: number = 1, limit: number = 10, status?: string): Promise<ApiResponse<ShipmentData[]>> => {
    return await new TrackingService().getAllShipments(page, limit, status);
  },

  deleteShipment: async (trackingId: string): Promise<void> => {
    await new TrackingService().deleteShipment(trackingId);
  },

  // Get all dropdown options
  getDropdownOptions: async (): Promise<Record<string, DropdownOption[]>> => {
    try {
      console.log('🔍 Fetching all dropdown options...');
      const response = await fetch(`${API_BASE_URL}/dropdown-options`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Dropdown options fetched successfully:', result.data);
      return result.data;
    } catch (error) {
      console.error('❌ Error fetching dropdown options:', error);
      throw error;
    }
  },

  // Get filtered dropdown options for a specific category
  getFilteredDropdownOptions: async (
    category: string, 
    filters?: { filter?: string; region?: string; priceRange?: string }
  ): Promise<DropdownOption[]> => {
    try {
      console.log(`🔍 Fetching filtered ${category} options...`, filters);
      
      const queryParams = new URLSearchParams();
      if (filters?.filter) queryParams.append('filter', filters.filter);
      if (filters?.region) queryParams.append('region', filters.region);
      if (filters?.priceRange) queryParams.append('priceRange', filters.priceRange);
      
      const url = `${API_BASE_URL}/dropdown-options/${category}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log(`✅ Filtered ${category} options fetched successfully:`, result.data);
      return result.data;
    } catch (error) {
      console.error(`❌ Error fetching filtered ${category} options:`, error);
      throw error;
    }
  },

  // Get service recommendations
  getServiceRecommendations: async (criteria: {
    urgency?: string;
    budget?: string;
    destination?: string;
    weight?: string;
    packageType?: string;
  }): Promise<{
    recommendations: ServiceRecommendation[];
    topRecommendation: ServiceRecommendation;
    alternativeOptions: ServiceRecommendation[];
  }> => {
    try {
      console.log('🔍 Getting service recommendations...', criteria);
      
      const response = await fetch(`${API_BASE_URL}/shipments/service-recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(criteria),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Service recommendations fetched successfully:', result.data);
      return result.data;
    } catch (error) {
      console.error('❌ Error getting service recommendations:', error);
      throw error;
    }
  },

  // Validate address
  validateAddress: async (address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }): Promise<ValidationResult> => {
    try {
      console.log('🔍 Validating address...', address);
      
      const response = await fetch(`${API_BASE_URL}/shipments/validate-address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Address validation completed:', result.data);
      return result.data;
    } catch (error) {
      console.error('❌ Error validating address:', error);
      throw error;
    }
  },

  // Validate tracking ID
  validateTrackingId: async (trackingId: string): Promise<ValidationResult> => {
    try {
      console.log('🔍 Validating tracking ID...', trackingId);
      
      const response = await fetch(`${API_BASE_URL}/shipments/validate-tracking-id`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trackingId }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Tracking ID validation completed:', result.data);
      return result.data;
    } catch (error) {
      console.error('❌ Error validating tracking ID:', error);
      throw error;
    }
  },

  // Get shipment statistics
  getStatistics: async (timeframe: '7d' | '30d' | '90d' = '30d'): Promise<ShipmentStatistics> => {
    try {
      console.log(`🔍 Fetching shipment statistics for ${timeframe}...`);
      
      const response = await fetch(`${API_BASE_URL}/shipments/statistics?timeframe=${timeframe}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Statistics fetched successfully:', result.data);
      return result.data;
    } catch (error) {
      console.error('❌ Error fetching statistics:', error);
      throw error;
    }
  },

  // Calculate delivery date
  calculateDeliveryDate: async (serviceType: string, startDate: string): Promise<string> => {
    try {
      console.log('🔍 Calculating delivery date...', { serviceType, startDate });
      
      const response = await fetch(`${API_BASE_URL}/shipments/calculate-delivery-date`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serviceType, startDate }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Delivery date calculated:', result.data.estimatedDelivery);
      return result.data.estimatedDelivery;
    } catch (error) {
      console.error('❌ Error calculating delivery date:', error);
      throw error;
    }
  },

  // Bulk operations
  bulkUpdate: async (operation: 'update-status' | 'delete', shipmentIds: string[], updateData?: any): Promise<{
    successful: Array<{ id: string; trackingId: string }>;
    failed: Array<{ id: string; reason: string }>;
    total: number;
  }> => {
    try {
      console.log('🔍 Performing bulk operation...', { operation, shipmentIds, updateData });
      
      const response = await fetch(`${API_BASE_URL}/shipments/bulk-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ operation, shipmentIds, updateData }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Bulk operation completed:', result.data);
      return result.data;
    } catch (error) {
      console.error('❌ Error performing bulk operation:', error);
      throw error;
    }
  }
};

// Admin Authentication API
export const adminAPI = {
  // Login admin user
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (data.success && data.data?.token) {
        // Store token securely
        localStorage.setItem('admin_token', data.data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.data.admin));
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.'
      };
    }
  },

  // Get admin profile
  getProfile: async (): Promise<{ success: boolean; data?: { admin: AdminUser }; message?: string }> => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        return { success: false, message: 'No authentication token found' };
      }

      const response = await fetch(`${API_BASE_URL}/admin/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!data.success && response.status === 401) {
        // Token is invalid, clear storage
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      }

      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.'
      };
    }
  },

  // Update admin profile
  updateProfile: async (profileData: { name: string; email: string }): Promise<{ success: boolean; message: string; data?: { admin: AdminUser } }> => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        return { success: false, message: 'No authentication token found' };
      }

      const response = await fetch(`${API_BASE_URL}/admin/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      
      if (data.success && data.data?.admin) {
        // Update stored user data
        localStorage.setItem('admin_user', JSON.stringify(data.data.admin));
      }

      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.'
      };
    }
  },

  // Change password
  changePassword: async (passwordData: PasswordChangeData): Promise<{ success: boolean; message: string }> => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        return { success: false, message: 'No authentication token found' };
      }

      const response = await fetch(`${API_BASE_URL}/admin/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });

      return await response.json();
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.'
      };
    }
  },

  // Verify token
  verifyToken: async (): Promise<{ success: boolean; data?: { admin: AdminUser }; message?: string }> => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        return { success: false, message: 'No authentication token found' };
      }

      const response = await fetch(`${API_BASE_URL}/admin/verify-token`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!data.success && response.status === 401) {
        // Token is invalid, clear storage
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      }

      return data;
    } catch (error) {
      console.error('Token verification error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.'
      };
    }
  },

  // Logout
  logout: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const token = localStorage.getItem('admin_token');
      if (token) {
        await fetch(`${API_BASE_URL}/admin/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    }

    return { success: true, message: 'Logged out successfully' };
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('admin_token');
    const user = localStorage.getItem('admin_user');
    return !!(token && user);
  },

  // Get stored user data
  getStoredUser: (): AdminUser | null => {
    try {
      const userData = localStorage.getItem('admin_user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  }
};

export default new TrackingService();
