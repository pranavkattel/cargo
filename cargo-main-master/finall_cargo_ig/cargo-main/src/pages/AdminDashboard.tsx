import React, { useState, useEffect } from 'react';
import { trackingAPI, ShipmentData } from '../services/trackingService';

interface DashboardStats {
  totalOrders: number;
  inTransit: number;
  deliveredToday: number;
  delayedOrUrgent: number;
  pendingOrders: number;
  statusDistribution: Record<string, number>;
}

interface AdminActivity {
  id: string;
  adminName: string;
  action: string;
  orderRef: string;
  timestamp: string;
  details: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    inTransit: 0,
    deliveredToday: 0,
    delayedOrUrgent: 0,
    pendingOrders: 0,
    statusDistribution: {}
  });
  
  const [recentOrders, setRecentOrders] = useState<ShipmentData[]>([]);
  const [urgentOrders, setUrgentOrders] = useState<ShipmentData[]>([]);
  const [adminActivity, setAdminActivity] = useState<AdminActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch all orders to calculate stats
      const ordersResponse = await trackingAPI.getAllShipments();
      const orders = ordersResponse.data || [];
      
      // Calculate statistics
      const today = new Date().toISOString().split('T')[0];
      const stats: DashboardStats = {
        totalOrders: orders.length,
        inTransit: orders.filter(o => o.status === 'in-transit').length,
        deliveredToday: orders.filter(o => 
          o.status === 'delivered' && 
          o.estimatedDelivery?.startsWith(today)
        ).length,
        delayedOrUrgent: orders.filter(o => {
          const estDelivery = new Date(o.estimatedDelivery || '');
          const now = new Date();
          return estDelivery < now && o.status !== 'delivered';
        }).length,
        pendingOrders: orders.filter(o => o.status === 'processing' || o.status === 'pending').length,
        statusDistribution: orders.reduce((acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };

      setStats(stats);
      
      // Get recent orders (last 10)
      const sortedOrders = orders
        .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
        .slice(0, 10);
      setRecentOrders(sortedOrders);
      
      // Get urgent/delayed orders
      const urgent = orders.filter(o => {
        const estDelivery = new Date(o.estimatedDelivery || '');
        const now = new Date();
        return estDelivery < now && o.status !== 'delivered';
      }).slice(0, 5);
      setUrgentOrders(urgent);

      // Mock admin activity for now
      const mockActivity: AdminActivity[] = [
        {
          id: '1',
          adminName: 'John Admin',
          action: 'Updated Status',
          orderRef: orders[0]?.trackingId || 'CC001234',
          timestamp: new Date().toISOString(),
          details: 'Changed status from "In Transit" to "Delivered"'
        },
        {
          id: '2',
          adminName: 'Sarah Manager',
          action: 'Created Order',
          orderRef: orders[1]?.trackingId || 'CC001235',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          details: 'New shipment created for customer'
        }
      ];
      setAdminActivity(mockActivity);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      'delivered': 'bg-green-100 text-green-800',
      'in-transit': 'bg-blue-100 text-blue-800',
      'processing': 'bg-yellow-100 text-yellow-800',
      'pending': 'bg-gray-100 text-gray-800',
      'out-for-delivery': 'bg-orange-100 text-orange-800',
      'cancelled': 'bg-red-100 text-red-800',
      'returned': 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string): string => {
    const icons: Record<string, string> = {
      'delivered': '✅',
      'in-transit': '🚚',
      'processing': '⏳',
      'pending': '📋',
      'out-for-delivery': '🚛',
      'cancelled': '❌',
      'returned': '↩️'
    };
    return icons[status] || '📦';
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your cargo management system</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">📦</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Transit</p>
              <p className="text-3xl font-bold text-blue-600">{stats.inTransit}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">🚚</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Delivered Today</p>
              <p className="text-3xl font-bold text-green-600">{stats.deliveredToday}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Delayed/Urgent</p>
              <p className="text-3xl font-bold text-red-600">{stats.delayedOrUrgent}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
          <div className="space-y-3">
            {Object.entries(stats.statusDistribution).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getStatusIcon(status)}</span>
                  <span className="capitalize font-medium text-gray-700">{status.replace('-', ' ')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">{count}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(count / stats.totalOrders) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Activity Feed */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Admin Activity</h3>
          <div className="space-y-4">
            {adminActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm">👤</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.adminName} • {activity.action}
                  </p>
                  <p className="text-sm text-gray-600">{activity.details}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Order: {activity.orderRef} • {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.trackingId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{order.trackingId}</p>
                  <p className="text-sm text-gray-600">{order.customerInfo.name}</p>
                  <p className="text-xs text-gray-500">
                    {order.shipmentDetails.origin} → {order.shipmentDetails.destination}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)} {order.status.replace('-', ' ')}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(order.estimatedDelivery || '').toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Urgent/Delayed Orders */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Urgent/Delayed Orders</h3>
          <div className="space-y-3">
            {urgentOrders.length > 0 ? urgentOrders.map((order) => (
              <div key={order.trackingId} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{order.trackingId}</p>
                  <p className="text-sm text-gray-600">{order.customerInfo.name}</p>
                  <p className="text-xs text-red-600">
                    Delayed since {new Date(order.estimatedDelivery || '').toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                    ⚠️ Urgent
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center text-gray-500 py-8">
                <span className="text-4xl">🎉</span>
                <p className="mt-2">No urgent orders!</p>
                <p className="text-sm">All shipments are on track.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
