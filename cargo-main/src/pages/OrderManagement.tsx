import React, { useState, useEffect } from 'react';
import { trackingAPI, ShipmentData, DropdownOption } from '../services/trackingService';

interface OrderHistoryEntry {
  id: string;
  timestamp: string;
  adminName: string;
  action: string;
  oldValue?: string;
  newValue?: string;
  notes?: string;
}

interface DeliveryPersonnel {
  id: string;
  name: string;
  phone: string;
  assignedOrders: number;
}

interface Hub {
  id: string;
  name: string;
  address: string;
  capacity: number;
}

interface OrderDocument {
  id: string;
  name: string;
  type: 'invoice' | 'receipt' | 'id' | 'other';
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

interface ExtendedShipmentData extends ShipmentData {
  assignedPersonnel?: string;
  assignedHub?: string;
  internalNotes?: string;
  documents?: OrderDocument[];
  history?: OrderHistoryEntry[];
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<ExtendedShipmentData[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<ExtendedShipmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [selectedOrder, setSelectedOrder] = useState<ExtendedShipmentData | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [personnelFilter, setPersonnelFilter] = useState('');
  const [hubFilter, setHubFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof ExtendedShipmentData>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Dropdown options
  const [dropdownOptions, setDropdownOptions] = useState<Record<string, DropdownOption[]>>({});
  const [deliveryPersonnel, setDeliveryPersonnel] = useState<DeliveryPersonnel[]>([]);
  const [hubs, setHubs] = useState<Hub[]>([]);

  // Custom status flow
  const customStatusFlow = [
    { value: 'pending', label: 'Pending', color: 'bg-gray-100 text-gray-800', icon: '📋' },
    { value: 'received', label: 'Received', color: 'bg-blue-100 text-blue-800', icon: '📥' },
    { value: 'in-transit', label: 'In Transit', color: 'bg-yellow-100 text-yellow-800', icon: '🚚' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800', icon: '✅' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, searchTerm, statusFilter, dateFilter, personnelFilter, hubFilter, priorityFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch orders
      const ordersResponse = await trackingAPI.getAllShipments();
      const baseOrders = ordersResponse.data || [];
      
      // Extend orders with additional data (in real app, this would come from API)
      const extendedOrders: ExtendedShipmentData[] = baseOrders.map(order => ({
        ...order,
        assignedPersonnel: Math.random() > 0.5 ? 'John Driver' : 'Sarah Courier',
        assignedHub: Math.random() > 0.5 ? 'Main Hub' : 'North Branch',
        internalNotes: 'Handle with care - fragile items',
        priority: ['low', 'normal', 'high', 'urgent'][Math.floor(Math.random() * 4)] as any,
        documents: [
          {
            id: '1',
            name: 'Invoice_' + order.trackingId + '.pdf',
            type: 'invoice',
            url: '#',
            uploadedAt: new Date().toISOString(),
            uploadedBy: 'Admin'
          }
        ],
        history: [
          {
            id: '1',
            timestamp: new Date().toISOString(),
            adminName: 'John Admin',
            action: 'Status Updated',
            oldValue: 'pending',
            newValue: order.status,
            notes: 'Automatic status update'
          }
        ]
      }));
      
      setOrders(extendedOrders);
      
      // Fetch dropdown options
      const options = await trackingAPI.getDropdownOptions();
      setDropdownOptions(options);
      
      // Mock data for personnel and hubs
      setDeliveryPersonnel([
        { id: '1', name: 'John Driver', phone: '+1234567890', assignedOrders: 5 },
        { id: '2', name: 'Sarah Courier', phone: '+1234567891', assignedOrders: 3 },
        { id: '3', name: 'Mike Delivery', phone: '+1234567892', assignedOrders: 7 }
      ]);
      
      setHubs([
        { id: '1', name: 'Main Hub', address: '123 Main St', capacity: 1000 },
        { id: '2', name: 'North Branch', address: '456 North Ave', capacity: 500 },
        { id: '3', name: 'South Branch', address: '789 South Rd', capacity: 300 }
      ]);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.trackingId.toLowerCase().includes(term) ||
        order.customerInfo.name.toLowerCase().includes(term) ||
        order.customerInfo.phone.includes(term) ||
        order.shipmentDetails.origin.toLowerCase().includes(term) ||
        order.shipmentDetails.destination.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter).toISOString().split('T')[0];
      filtered = filtered.filter(order => 
        order.estimatedDelivery?.startsWith(filterDate) ||
        order.createdAt?.startsWith(filterDate)
      );
    }

    // Personnel filter
    if (personnelFilter) {
      filtered = filtered.filter(order => order.assignedPersonnel === personnelFilter);
    }

    // Hub filter
    if (hubFilter) {
      filtered = filtered.filter(order => order.assignedHub === hubFilter);
    }

    // Priority filter
    if (priorityFilter) {
      filtered = filtered.filter(order => order.priority === priorityFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredOrders(filtered);
  };

  const handleSort = (field: keyof ExtendedShipmentData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string, notes?: string) => {
    try {
      // Add to history
      const order = orders.find(o => o.trackingId === orderId);
      if (order) {
        const historyEntry: OrderHistoryEntry = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          adminName: 'Current Admin', // In real app, get from auth
          action: 'Status Updated',
          oldValue: order.status,
          newValue: newStatus,
          notes: notes || ''
        };

        // Update order
        const updatedOrders = orders.map(o => 
          o.trackingId === orderId 
            ? { 
                ...o, 
                status: newStatus, 
                history: [historyEntry, ...(o.history || [])]
              }
            : o
        );
        
        setOrders(updatedOrders);
        
        // Call API to update status
        await trackingAPI.updateShipmentStatus(orderId, newStatus, notes || '', '');
      }
    } catch (error) {
      setError('Failed to update status');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      // In real app, call delete API
      const updatedOrders = orders.filter(o => o.trackingId !== orderId);
      setOrders(updatedOrders);
      setShowDeleteConfirm(null);
    } catch (error) {
      setError('Failed to delete order');
    }
  };

  const getStatusColor = (status: string): string => {
    const statusObj = customStatusFlow.find(s => s.value === status);
    return statusObj?.color || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string): string => {
    const statusObj = customStatusFlow.find(s => s.value === status);
    return statusObj?.icon || '📦';
  };

  const getPriorityColor = (priority: string): string => {
    const colors: Record<string, string> = {
      'low': 'bg-green-100 text-green-800',
      'normal': 'bg-blue-100 text-blue-800',
      'high': 'bg-yellow-100 text-yellow-800',
      'urgent': 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
        <p className="text-gray-600">Comprehensive order tracking and management</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Filters & Search</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Tracking ID, customer, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              {customStatusFlow.map(status => (
                <option key={status.value} value={status.value}>
                  {status.icon} {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Personnel Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Personnel</label>
            <select
              value={personnelFilter}
              onChange={(e) => setPersonnelFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Personnel</option>
              {deliveryPersonnel.map(person => (
                <option key={person.id} value={person.name}>
                  {person.name} ({person.assignedOrders} orders)
                </option>
              ))}
            </select>
          </div>

          {/* Hub Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hub</label>
            <select
              value={hubFilter}
              onChange={(e) => setHubFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Hubs</option>
              {hubs.map(hub => (
                <option key={hub.id} value={hub.name}>
                  {hub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Priorities</option>
              <option value="low">🟢 Low</option>
              <option value="normal">🔵 Normal</option>
              <option value="high">🟡 High</option>
              <option value="urgent">🔴 Urgent</option>
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        <button
          onClick={() => {
            setSearchTerm('');
            setStatusFilter('');
            setDateFilter('');
            setPersonnelFilter('');
            setHubFilter('');
            setPriorityFilter('');
          }}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          Clear All Filters
        </button>
      </div>

      {/* Results Summary */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Per page:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('trackingId')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Tracking ID</span>
                    {sortField === 'trackingId' && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('customerInfo')}
                >
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Personnel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hub
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('estimatedDelivery')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Est. Delivery</span>
                    {sortField === 'estimatedDelivery' && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedOrders.map((order) => (
                <tr key={order.trackingId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.trackingId}</div>
                    <div className="text-xs text-gray-500">
                      {order.documents?.length || 0} doc(s)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.customerInfo.name}</div>
                    <div className="text-sm text-gray-500">{order.customerInfo.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.shipmentDetails.origin}</div>
                    <div className="text-sm text-gray-500">↓ {order.shipmentDetails.destination}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)} {order.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(order.priority || 'normal')}`}>
                      {order.priority || 'normal'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.assignedPersonnel || 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.assignedHub || 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.estimatedDelivery || '').toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(order.trackingId)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Delete Order"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-lg shadow-md p-4 mt-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 text-sm border border-gray-300 rounded ${
                      currentPage === page
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Order Details - {selectedOrder.trackingId}</h3>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Status Update Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-3">Update Status</h4>
                <div className="flex space-x-2">
                  {customStatusFlow.map(status => (
                    <button
                      key={status.value}
                      onClick={() => handleStatusUpdate(selectedOrder.trackingId, status.value)}
                      className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                        selectedOrder.status === status.value
                          ? status.color
                          : 'bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {status.icon} {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Customer Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {selectedOrder.customerInfo.name}</p>
                    <p><strong>Email:</strong> {selectedOrder.customerInfo.email}</p>
                    <p><strong>Phone:</strong> {selectedOrder.customerInfo.phone}</p>
                    <p><strong>Address:</strong> {selectedOrder.customerInfo.address}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Shipment Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Origin:</strong> {selectedOrder.shipmentDetails.origin}</p>
                    <p><strong>Destination:</strong> {selectedOrder.shipmentDetails.destination}</p>
                    <p><strong>Weight:</strong> {selectedOrder.shipmentDetails.weight} kg</p>
                    <p><strong>Service:</strong> {selectedOrder.shipmentDetails.serviceType}</p>
                    <p><strong>Description:</strong> {selectedOrder.shipmentDetails.description}</p>
                  </div>
                </div>
              </div>

              {/* Assignment Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Assignments</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Personnel</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="">Select Personnel</option>
                        {deliveryPersonnel.map(person => (
                          <option key={person.id} value={person.name}>
                            {person.name} - {person.phone}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hub/Branch</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="">Select Hub</option>
                        {hubs.map(hub => (
                          <option key={hub.id} value={hub.name}>
                            {hub.name} - {hub.address}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Internal Notes</h4>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows={4}
                    placeholder="Add internal notes..."
                    defaultValue={selectedOrder.internalNotes}
                  />
                </div>
              </div>

              {/* Documents Section */}
              <div>
                <h4 className="font-medium mb-3">Documents</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedOrder.documents?.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">📄</span>
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-gray-500">
                            {doc.type} • {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        View
                      </button>
                    </div>
                  ))}
                  
                  <div className="flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer">
                    <div className="text-center">
                      <span className="text-2xl">📁</span>
                      <p className="text-sm text-gray-600 mt-1">Upload Document</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* History Section */}
              <div>
                <h4 className="font-medium mb-3">Order History</h4>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {selectedOrder.history?.map(entry => (
                    <div key={entry.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs">📝</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {entry.adminName} • {entry.action}
                        </p>
                        {entry.oldValue && entry.newValue && (
                          <p className="text-xs text-gray-600">
                            Changed from "{entry.oldValue}" to "{entry.newValue}"
                          </p>
                        )}
                        {entry.notes && (
                          <p className="text-xs text-gray-500 mt-1">{entry.notes}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(entry.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowOrderModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete order {showDeleteConfirm}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteOrder(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
