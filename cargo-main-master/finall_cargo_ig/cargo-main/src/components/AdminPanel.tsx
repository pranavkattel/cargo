import React, { useState, useEffect } from 'react';
import { trackingAPI, ShipmentData, DropdownOption, ShipmentStatistics, ServiceRecommendation } from '../services/trackingService';
import { StatusDropdown, ServiceTypeDropdown } from './EnhancedDropdown';
import MapDestinationSelector from './MapDestinationSelector';

interface AdminPanelProps {
  // Props if needed
}

interface FormData {
  status: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  shipmentDetails: {
    origin: string;
    destination: string;
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    serviceType: string;
    description: string;
    value: number;
  };
}

export const AdminPanel: React.FC<AdminPanelProps> = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'dashboard' | 'create' | 'manage' | 'bulk'>('dashboard');
  const [shipments, setShipments] = useState<ShipmentData[]>([]);
  const [statistics, setStatistics] = useState<ShipmentStatistics | null>(null);
  const [dropdownOptions, setDropdownOptions] = useState<Record<string, DropdownOption[]>>({});
  const [loading, setLoading] = useState(false);
  const [selectedShipments, setSelectedShipments] = useState<string[]>([]);
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    status: 'processing',
    customerInfo: {
      name: '',
      email: '',
      phone: '',
      address: ''
    },
    shipmentDetails: {
      origin: '',
      destination: '',
      weight: 0,
      dimensions: { length: 0, width: 0, height: 0 },
      serviceType: '',
      description: '',
      value: 0
    }
  });

  // Service recommendations
  const [recommendations, setRecommendations] = useState<{
    recommendations: ServiceRecommendation[];
    topRecommendation: ServiceRecommendation;
    alternativeOptions: ServiceRecommendation[];
  } | null>(null);

  // Validation states
  const [addressValidation, setAddressValidation] = useState<any>(null);
  
  // Map destination selection
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
    city: string;
    country: string;
    formattedAddress: string;
  } | null>(null);
  const [showMap, setShowMap] = useState(false);

  // Initialize component
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      try {
        // Load all dropdown options
        const options = await trackingAPI.getDropdownOptions();
        setDropdownOptions(options);

        // Load statistics
        const stats = await trackingAPI.getStatistics('30d');
        setStatistics(stats);

        // Load recent shipments
        const recentShipments = await trackingAPI.getAllShipments();
        if (recentShipments.success && recentShipments.data) {
          setShipments(recentShipments.data.slice(0, 10)); // Show 10 most recent
        }
      } catch (error) {
        console.error('Failed to initialize admin panel:', error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  // Get service recommendations when criteria change
  useEffect(() => {
    const getRecommendations = async () => {
      if (formData.shipmentDetails.weight > 0 && formData.shipmentDetails.destination) {
        try {
          const recs = await trackingAPI.getServiceRecommendations({
            urgency: 'normal',
            destination: formData.shipmentDetails.destination,
            weight: formData.shipmentDetails.weight.toString(),
            packageType: 'box'
          });
          setRecommendations(recs);
        } catch (error) {
          console.error('Failed to get recommendations:', error);
        }
      }
    };

    getRecommendations();
  }, [formData.shipmentDetails.weight, formData.shipmentDetails.destination]);

  // Handle form submission
  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate address first
      const addressParts = formData.customerInfo.address.split(',').map(part => part.trim());
      if (addressParts.length >= 4) {
        const addressValidationResult = await trackingAPI.validateAddress({
          street: addressParts[0],
          city: addressParts[1],
          state: addressParts[2],
          zipCode: addressParts[3],
          country: addressParts[4] || 'US'
        });

        if (!addressValidationResult.isValid) {
          setAddressValidation(addressValidationResult);
          return;
        }
      }

      // Create shipment
      await trackingAPI.createShipment({
        customerInfo: formData.customerInfo,
        shipmentDetails: formData.shipmentDetails,
        status: formData.status,
        events: [],
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      });

      // Reset form and refresh data
      setFormData({
        status: 'processing',
        customerInfo: { name: '', email: '', phone: '', address: '' },
        shipmentDetails: {
          origin: '', destination: '', weight: 0,
          dimensions: { length: 0, width: 0, height: 0 },
          serviceType: '', description: '', value: 0
        }
      });

      // Refresh shipments list
      const updatedShipments = await trackingAPI.getAllShipments();
      if (updatedShipments.success && updatedShipments.data) {
        setShipments(updatedShipments.data.slice(0, 10));
      }

      alert('Shipment created successfully!');
    } catch (error) {
      console.error('Failed to create shipment:', error);
      alert('Failed to create shipment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle bulk operations
  const handleBulkOperation = async (operation: 'update-status' | 'delete', updateData?: any) => {
    if (selectedShipments.length === 0) {
      alert('Please select shipments first');
      return;
    }

    if (operation === 'delete' && !confirm(`Are you sure you want to delete ${selectedShipments.length} shipments?`)) {
      return;
    }

    setLoading(true);
    try {
      const result = await trackingAPI.bulkUpdate(operation, selectedShipments, updateData);
      
      alert(`Bulk operation completed: ${result.successful.length} successful, ${result.failed.length} failed`);
      
      // Refresh shipments
      const updatedShipments = await trackingAPI.getAllShipments();
      if (updatedShipments.success && updatedShipments.data) {
        setShipments(updatedShipments.data.slice(0, 10));
      }
      setSelectedShipments([]);
    } catch (error) {
      console.error('Bulk operation failed:', error);
      alert('Bulk operation failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle individual shipment updates
  const handleStatusUpdate = async (shipmentId: string, newStatus: string) => {
    try {
      await trackingAPI.updateShipmentStatus(
        shipmentId, 
        newStatus, 
        `Status updated to ${newStatus}`, 
        'Admin Panel'
      );
      
      // Refresh shipments
      const updatedShipments = await trackingAPI.getAllShipments();
      if (updatedShipments.success && updatedShipments.data) {
        setShipments(updatedShipments.data.slice(0, 10));
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    }
  };

  if (loading && !statistics) {
    return <div className="loading">Loading admin panel...</div>;
  }

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1>Cargo Tracking Admin Panel</h1>
        <nav className="admin-nav">
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={activeTab === 'create' ? 'active' : ''}
            onClick={() => setActiveTab('create')}
          >
            ➕ Create Shipment
          </button>
          <button 
            className={activeTab === 'manage' ? 'active' : ''}
            onClick={() => setActiveTab('manage')}
          >
            📦 Manage Shipments
          </button>
          <button 
            className={activeTab === 'bulk' ? 'active' : ''}
            onClick={() => setActiveTab('bulk')}
          >
            🔄 Bulk Operations
          </button>
        </nav>
      </header>

      <main className="admin-content">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && statistics && (
          <div className="dashboard">
            <h2>Shipment Statistics</h2>
            
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Shipments</h3>
                <div className="stat-value">{statistics.summary.totalShipments}</div>
              </div>
              <div className="stat-card">
                <h3>Delivered</h3>
                <div className="stat-value">{statistics.summary.deliveredShipments}</div>
              </div>
              <div className="stat-card">
                <h3>In Transit</h3>
                <div className="stat-value">{statistics.summary.inTransitShipments}</div>
              </div>
              <div className="stat-card">
                <h3>Delivery Rate</h3>
                <div className="stat-value">{statistics.summary.deliveryRate}%</div>
              </div>
            </div>

            <div className="charts-section">
              <div className="chart">
                <h3>Status Breakdown</h3>
                {statistics.breakdowns.status.map(item => (
                  <div key={item._id} className="chart-bar">
                    <span className="label">{item._id}</span>
                    <div className="bar" style={{ width: `${(item.count / statistics.summary.totalShipments) * 100}%` }}>
                      {item.count}
                    </div>
                  </div>
                ))}
              </div>

              <div className="chart">
                <h3>Service Type Usage</h3>
                {statistics.breakdowns.serviceType.map(item => (
                  <div key={item._id} className="chart-bar">
                    <span className="label">{item._id}</span>
                    <div className="bar" style={{ width: `${(item.count / statistics.summary.totalShipments) * 100}%` }}>
                      {item.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Create Shipment Tab */}
        {activeTab === 'create' && (
          <div className="create-shipment">
            <h2>Create New Shipment</h2>
            
            <form onSubmit={handleCreateShipment} className="shipment-form">
              <div className="form-section">
                <h3>Customer Information</h3>
                <div className="form-grid">
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={formData.customerInfo.name}
                    onChange={(e) => setFormData({
                      ...formData,
                      customerInfo: { ...formData.customerInfo, name: e.target.value }
                    })}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.customerInfo.email}
                    onChange={(e) => setFormData({
                      ...formData,
                      customerInfo: { ...formData.customerInfo, email: e.target.value }
                    })}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.customerInfo.phone}
                    onChange={(e) => setFormData({
                      ...formData,
                      customerInfo: { ...formData.customerInfo, phone: e.target.value }
                    })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Address (Street, City, State, ZIP, Country)"
                    value={formData.customerInfo.address}
                    onChange={(e) => setFormData({
                      ...formData,
                      customerInfo: { ...formData.customerInfo, address: e.target.value }
                    })}
                    required
                  />
                </div>

                {addressValidation && !addressValidation.isValid && (
                  <div className="validation-errors">
                    <h4>Address Issues:</h4>
                    {addressValidation.errors.map((error: string, idx: number) => (
                      <div key={idx} className="error">{error}</div>
                    ))}
                    <h4>Suggestions:</h4>
                    {addressValidation.suggestions.map((suggestion: string, idx: number) => (
                      <div key={idx} className="suggestion">{suggestion}</div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-section">
                <h3>Shipment Status & Service</h3>
                <div className="form-grid grid-cols-2">
                  <StatusDropdown
                    value={formData.status}
                    onChange={(value) => setFormData({
                      ...formData,
                      status: value
                    })}
                    options={dropdownOptions.status || []}
                    className="mb-4"
                  />
                  
                  <ServiceTypeDropdown
                    value={formData.shipmentDetails.serviceType}
                    onChange={(value) => setFormData({
                      ...formData,
                      shipmentDetails: { ...formData.shipmentDetails, serviceType: value }
                    })}
                    options={dropdownOptions.serviceType || []}
                    className="mb-4"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Shipment Details</h3>
                <div className="form-grid">
                  <input
                    type="text"
                    placeholder="Origin"
                    value={formData.shipmentDetails.origin}
                    onChange={(e) => setFormData({
                      ...formData,
                      shipmentDetails: { ...formData.shipmentDetails, origin: e.target.value }
                    })}
                    required
                  />
                  
                  {/* Destination Selection with Map */}
                  <div className="destination-section col-span-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Destination Selection
                    </label>
                    
                    <div className="flex space-x-4 mb-4">
                      <button
                        type="button"
                        onClick={() => setShowMap(false)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          !showMap 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        📋 Country List
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowMap(true)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          showMap 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        🗺️ Map Selection
                      </button>
                    </div>

                    {!showMap ? (
                      <select
                        value={formData.shipmentDetails.destination}
                        onChange={(e) => setFormData({
                          ...formData,
                          shipmentDetails: { ...formData.shipmentDetails, destination: e.target.value }
                        })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Destination Country</option>
                        {dropdownOptions.countries?.map(country => (
                          <option key={country.value} value={country.value}>
                            {country.label} ({country.region})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div>
                        <MapDestinationSelector
                          onLocationSelect={(location) => {
                            setSelectedLocation(location);
                            setFormData({
                              ...formData,
                              shipmentDetails: { 
                                ...formData.shipmentDetails, 
                                destination: location.formattedAddress 
                              }
                            });
                          }}
                          className="mb-4"
                        />
                        {selectedLocation && (
                          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-medium text-blue-800 mb-1">Selected Destination</h4>
                            <p className="text-sm text-blue-700">
                              📍 {selectedLocation.city}, {selectedLocation.country}
                            </p>
                            <p className="text-xs text-blue-600">
                              Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <input
                    type="number"
                    placeholder="Weight (lbs)"
                    value={formData.shipmentDetails.weight}
                    onChange={(e) => setFormData({
                      ...formData,
                      shipmentDetails: { ...formData.shipmentDetails, weight: parseFloat(e.target.value) || 0 }
                    })}
                    required
                  />
                </div>

                <textarea
                  placeholder="Package Description"
                  value={formData.shipmentDetails.description}
                  onChange={(e) => setFormData({
                    ...formData,
                    shipmentDetails: { ...formData.shipmentDetails, description: e.target.value }
                  })}
                  required
                />

                <div className="dimensions-grid">
                  <input
                    type="number"
                    placeholder="Length (in)"
                    value={formData.shipmentDetails.dimensions.length}
                    onChange={(e) => setFormData({
                      ...formData,
                      shipmentDetails: {
                        ...formData.shipmentDetails,
                        dimensions: {
                          ...formData.shipmentDetails.dimensions,
                          length: parseFloat(e.target.value) || 0
                        }
                      }
                    })}
                  />
                  <input
                    type="number"
                    placeholder="Width (in)"
                    value={formData.shipmentDetails.dimensions.width}
                    onChange={(e) => setFormData({
                      ...formData,
                      shipmentDetails: {
                        ...formData.shipmentDetails,
                        dimensions: {
                          ...formData.shipmentDetails.dimensions,
                          width: parseFloat(e.target.value) || 0
                        }
                      }
                    })}
                  />
                  <input
                    type="number"
                    placeholder="Height (in)"
                    value={formData.shipmentDetails.dimensions.height}
                    onChange={(e) => setFormData({
                      ...formData,
                      shipmentDetails: {
                        ...formData.shipmentDetails,
                        dimensions: {
                          ...formData.shipmentDetails.dimensions,
                          height: parseFloat(e.target.value) || 0
                        }
                      }
                    })}
                  />
                </div>

                <input
                  type="number"
                  placeholder="Package Value ($)"
                  value={formData.shipmentDetails.value}
                  onChange={(e) => setFormData({
                    ...formData,
                    shipmentDetails: { ...formData.shipmentDetails, value: parseFloat(e.target.value) || 0 }
                  })}
                />
              </div>

              {/* Service Recommendations */}
              {recommendations && (
                <div className="recommendations-section">
                  <h3>🤖 Recommended Services</h3>
                  <div className="top-recommendation">
                    <div className="recommendation-card recommended">
                      <h4>{recommendations.topRecommendation.label}</h4>
                      <p className="confidence">Confidence: <strong>{recommendations.topRecommendation.confidence}</strong></p>
                      <div className="reasons">
                        {recommendations.topRecommendation.reasons.map((reason, idx) => (
                          <div key={idx} className="reason">✓ {reason}</div>
                        ))}
                      </div>
                      <button 
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          shipmentDetails: { ...formData.shipmentDetails, serviceType: recommendations.topRecommendation.value }
                        })}
                        className="select-service-btn"
                      >
                        Use This Service
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading} className="create-btn">
                {loading ? 'Creating...' : 'Create Shipment'}
              </button>
            </form>
          </div>
        )}

        {/* Manage Shipments Tab */}
        {activeTab === 'manage' && (
          <div className="manage-shipments">
            <h2>Recent Shipments</h2>
            
            <div className="shipments-table">
              <table>
                <thead>
                  <tr>
                    <th>Tracking ID</th>
                    <th>Customer</th>
                    <th>Destination</th>
                    <th>Status</th>
                    <th>Service Type</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.map(shipment => (
                    <tr key={shipment._id}>
                      <td>{shipment.trackingId}</td>
                      <td>{shipment.customerInfo.name}</td>
                      <td>{shipment.shipmentDetails.destination}</td>
                      <td>
                        <select
                          value={shipment.status}
                          onChange={(e) => handleStatusUpdate(shipment._id!, e.target.value)}
                          className="status-select"
                        >
                          {dropdownOptions.status?.map(status => (
                            <option key={status.value} value={status.value}>
                              {status.icon} {status.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>{shipment.shipmentDetails.serviceType}</td>
                      <td>{new Date(shipment.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button 
                          onClick={() => {/* Open edit modal */}}
                          className="action-btn"
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm('Delete this shipment?')) {
                              // Handle delete
                            }
                          }}
                          className="action-btn danger"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bulk Operations Tab */}
        {activeTab === 'bulk' && (
          <div className="bulk-operations">
            <h2>Bulk Operations</h2>
            
            <div className="bulk-controls">
              <div className="selection-info">
                <p>{selectedShipments.length} shipments selected</p>
                <button 
                  onClick={() => setSelectedShipments([])}
                  disabled={selectedShipments.length === 0}
                >
                  Clear Selection
                </button>
              </div>

              <div className="bulk-actions">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleBulkOperation('update-status', { status: e.target.value });
                      e.target.value = '';
                    }
                  }}
                  disabled={selectedShipments.length === 0}
                >
                  <option value="">Update Status to...</option>
                  {dropdownOptions.status?.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.icon} {status.label}
                    </option>
                  ))}
                </select>

                <button 
                  onClick={() => handleBulkOperation('delete')}
                  disabled={selectedShipments.length === 0}
                  className="danger"
                >
                  🗑️ Delete Selected
                </button>
              </div>
            </div>

            <div className="bulk-shipments-table">
              <table>
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedShipments(shipments.map(s => s._id!));
                          } else {
                            setSelectedShipments([]);
                          }
                        }}
                        checked={selectedShipments.length === shipments.length && shipments.length > 0}
                      />
                    </th>
                    <th>Tracking ID</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.map(shipment => (
                    <tr key={shipment._id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedShipments.includes(shipment._id!)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedShipments([...selectedShipments, shipment._id!]);
                            } else {
                              setSelectedShipments(selectedShipments.filter(id => id !== shipment._id));
                            }
                          }}
                        />
                      </td>
                      <td>{shipment.trackingId}</td>
                      <td>{shipment.customerInfo.name}</td>
                      <td>
                        {dropdownOptions.status?.find(s => s.value === shipment.status)?.icon} {shipment.status}
                      </td>
                      <td>{new Date(shipment.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
