import React, { useEffect, useState } from 'react';
import trackingService, { ShipmentData } from '../services/trackingService';

const AdminTracking: React.FC = () => {
  const [orders, setOrders] = useState<ShipmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editOrder, setEditOrder] = useState<ShipmentData | null>(null);

  // Debug: Log component mount
  console.log('AdminTracking component mounted');

  // Form state
  const [form, setForm] = useState({
    trackingId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    origin: '',
    destination: '',
    weight: '',
    serviceType: '',
    description: '',
    status: '',
    estimatedDelivery: '',
  });

  // Fetch all orders
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await trackingService.getAllShipments(1, 100);
      console.log('API Response:', res); // Debug log
      
      let orders = res.data || [];
      console.log('Orders from API:', orders); // Debug log
      
      // Fallback to mock/demo data if nothing in DB
      if (orders.length === 0) {
        console.log('No orders from API, using mock data'); // Debug log
        orders = [
          trackingService.generateMockTrackingData('DEMO123'),
          trackingService.generateMockTrackingData('TEST456'),
          trackingService.generateMockTrackingData('CC001234'),
          trackingService.generateMockTrackingData('CC005678'),
        ].filter(Boolean) as ShipmentData[];
      }
      
      console.log('Final orders to display:', orders); // Debug log
      setOrders(orders);
      if (orders.length > 0) {
        setError(null); // Clear error if we have data
      }
    } catch (e: any) {
      console.error('Fetch orders error:', e); // Debug log
      // On error, show mock/demo data
      const mockOrders = [
        trackingService.generateMockTrackingData('DEMO123'),
        trackingService.generateMockTrackingData('TEST456'),
        trackingService.generateMockTrackingData('CC001234'),
        trackingService.generateMockTrackingData('CC005678'),
      ].filter(Boolean) as ShipmentData[];
      
      setOrders(mockOrders);
      setError(`Failed to fetch orders from backend: ${e.message}. Showing demo data.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle form input
  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update order
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editOrder) {
        // Update status only for simplicity
        await trackingService.updateShipmentStatus(
          editOrder.trackingId,
          form.status,
          form.description,
          form.destination
        );
      } else {
        await trackingService.createShipment({
          customerInfo: {
            name: form.customerName,
            email: form.customerEmail,
            phone: form.customerPhone,
            address: form.customerAddress,
          },
          shipmentDetails: {
            origin: form.origin,
            destination: form.destination,
            weight: parseFloat(form.weight),
            serviceType: form.serviceType,
            description: form.description,
          },
          status: form.status,
          events: [],
          estimatedDelivery: form.estimatedDelivery,
        });
      }
      setShowForm(false);
      setEditOrder(null);
      fetchOrders();
    } catch (e) {
      setError('Failed to save order');
    }
  };

  // Edit order
  const handleEdit = (order: ShipmentData) => {
    setEditOrder(order);
    setForm({
      trackingId: order.trackingId,
      customerName: order.customerInfo.name,
      customerEmail: order.customerInfo.email,
      customerPhone: order.customerInfo.phone,
      customerAddress: order.customerInfo.address,
      origin: order.shipmentDetails.origin,
      destination: order.shipmentDetails.destination,
      weight: order.shipmentDetails.weight.toString(),
      serviceType: order.shipmentDetails.serviceType,
      description: order.shipmentDetails.description,
      status: order.status,
      estimatedDelivery: order.estimatedDelivery,
    });
    setShowForm(true);
  };

  // Delete order
  const handleDelete = async (trackingId: string) => {
    if (!window.confirm('Delete this order?')) return;
    console.log('Delete requested for:', trackingId);
    // TODO: Implement delete API in backend
    setError('Delete functionality not yet implemented in backend API');
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin: Manage Tracking Orders</h1>
      {error && <div className="bg-red-100 text-red-700 p-2 mb-4">{error}</div>}
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => {
          setShowForm(true);
          setEditOrder(null);
          setForm({
            trackingId: '', customerName: '', customerEmail: '', customerPhone: '', customerAddress: '',
            origin: '', destination: '', weight: '', serviceType: '', description: '', status: '', estimatedDelivery: '',
          });
        }}
      >Add New Order</button>
      {showForm && (
        <form className="bg-white p-4 rounded shadow mb-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="customerName" value={form.customerName} onChange={handleInput} placeholder="Customer Name" className="border p-2" required />
            <input name="customerEmail" value={form.customerEmail} onChange={handleInput} placeholder="Customer Email" className="border p-2" required />
            <input name="customerPhone" value={form.customerPhone} onChange={handleInput} placeholder="Customer Phone" className="border p-2" required />
            <input name="customerAddress" value={form.customerAddress} onChange={handleInput} placeholder="Customer Address" className="border p-2" required />
            <input name="origin" value={form.origin} onChange={handleInput} placeholder="Origin" className="border p-2" required />
            <input name="destination" value={form.destination} onChange={handleInput} placeholder="Destination" className="border p-2" required />
            <input name="weight" value={form.weight} onChange={handleInput} placeholder="Weight (kg)" className="border p-2" required />
            <input name="serviceType" value={form.serviceType} onChange={handleInput} placeholder="Service Type" className="border p-2" required />
            <input name="description" value={form.description} onChange={handleInput} placeholder="Description" className="border p-2" required />
            <input name="status" value={form.status} onChange={handleInput} placeholder="Status" className="border p-2" required />
            <input name="estimatedDelivery" value={form.estimatedDelivery} onChange={handleInput} placeholder="Estimated Delivery (ISO)" className="border p-2" required />
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">{editOrder ? 'Update' : 'Add'} Order</button>
            <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Tracking ID</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Origin</th>
              <th className="p-2">Destination</th>
              <th className="p-2">Status</th>
              <th className="p-2">Est. Delivery</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.trackingId} className="border-t">
                <td className="p-2 font-mono">{order.trackingId}</td>
                <td className="p-2">{order.customerInfo.name}</td>
                <td className="p-2">{order.shipmentDetails.origin}</td>
                <td className="p-2">{order.shipmentDetails.destination}</td>
                <td className="p-2">{order.status}</td>
                <td className="p-2">{order.estimatedDelivery?.slice(0,10)}</td>
                <td className="p-2 flex gap-2">
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded" onClick={() => handleEdit(order)}>Edit</button>
                  <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleDelete(order.trackingId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminTracking;
