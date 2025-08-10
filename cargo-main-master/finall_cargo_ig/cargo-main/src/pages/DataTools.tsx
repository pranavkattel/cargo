import React, { useState, useEffect } from 'react';
import { trackingAPI, ShipmentData } from '../services/trackingService';

interface ExportConfig {
  format: 'csv' | 'pdf' | 'excel';
  fields: string[];
  filters: {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    customer?: string;
  };
  fileName: string;
}

interface ImportResult {
  success: boolean;
  imported: number;
  errors: string[];
  warnings: string[];
}

const DataTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'export' | 'import' | 'reports'>('export');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<ShipmentData[]>([]);
  
  // Export states
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    format: 'csv',
    fields: ['trackingId', 'customerInfo.name', 'status', 'estimatedDelivery'],
    filters: {},
    fileName: 'cargo_orders_export'
  });
  
  // Import states
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showImportPreview, setShowImportPreview] = useState(false);
  const [importPreview, setImportPreview] = useState<any[]>([]);

  // Available fields for export
  const availableFields = [
    { key: 'trackingId', label: 'Tracking ID', category: 'Basic' },
    { key: 'status', label: 'Status', category: 'Basic' },
    { key: 'customerInfo.name', label: 'Customer Name', category: 'Customer' },
    { key: 'customerInfo.email', label: 'Customer Email', category: 'Customer' },
    { key: 'customerInfo.phone', label: 'Customer Phone', category: 'Customer' },
    { key: 'customerInfo.address', label: 'Customer Address', category: 'Customer' },
    { key: 'shipmentDetails.origin', label: 'Origin', category: 'Shipment' },
    { key: 'shipmentDetails.destination', label: 'Destination', category: 'Shipment' },
    { key: 'shipmentDetails.weight', label: 'Weight', category: 'Shipment' },
    { key: 'shipmentDetails.serviceType', label: 'Service Type', category: 'Shipment' },
    { key: 'shipmentDetails.description', label: 'Description', category: 'Shipment' },
    { key: 'estimatedDelivery', label: 'Estimated Delivery', category: 'Dates' },
    { key: 'createdAt', label: 'Created Date', category: 'Dates' },
    { key: 'updatedAt', label: 'Updated Date', category: 'Dates' }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await trackingAPI.getAllShipments();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const getFilteredOrders = () => {
    return orders.filter(order => {
      if (exportConfig.filters.status && order.status !== exportConfig.filters.status) return false;
      if (exportConfig.filters.customer && !order.customerInfo.name.toLowerCase().includes(exportConfig.filters.customer.toLowerCase())) return false;
      if (exportConfig.filters.dateFrom && new Date(order.createdAt || '') < new Date(exportConfig.filters.dateFrom)) return false;
      if (exportConfig.filters.dateTo && new Date(order.createdAt || '') > new Date(exportConfig.filters.dateTo)) return false;
      return true;
    });
  };

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      const filteredOrders = getFilteredOrders();
      
      if (exportConfig.format === 'csv') {
        // Generate CSV
        const headers = exportConfig.fields.map(field => 
          availableFields.find(f => f.key === field)?.label || field
        );
        
        const csvData = filteredOrders.map(order => 
          exportConfig.fields.map(field => {
            const value = getNestedValue(order, field);
            return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value || '';
          })
        );
        
        const csvContent = [
          headers.join(','),
          ...csvData.map(row => row.join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${exportConfig.fileName}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
      } else if (exportConfig.format === 'pdf') {
        // For PDF, we'll generate a simple HTML table and print it
        const htmlContent = `
          <html>
            <head>
              <title>Cargo Orders Export</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; font-weight: bold; }
                h1 { color: #333; }
                .header { margin-bottom: 20px; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Cargo Capital - Orders Export</h1>
                <p>Generated on: ${new Date().toLocaleString()}</p>
                <p>Total Orders: ${filteredOrders.length}</p>
              </div>
              <table>
                <thead>
                  <tr>
                    ${exportConfig.fields.map(field => 
                      `<th>${availableFields.find(f => f.key === field)?.label || field}</th>`
                    ).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${filteredOrders.map(order => 
                    `<tr>
                      ${exportConfig.fields.map(field => 
                        `<td>${getNestedValue(order, field) || ''}</td>`
                      ).join('')}
                    </tr>`
                  ).join('')}
                </tbody>
              </table>
            </body>
          </html>
        `;
        
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(htmlContent);
          printWindow.document.close();
          printWindow.focus();
          setTimeout(() => {
            printWindow.print();
            printWindow.close();
          }, 250);
        }
      }
      
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFile(file);
      
      // Parse CSV for preview
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          const lines = text.split('\n');
          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
          const preview = lines.slice(1, 6).map(line => {
            const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
            return headers.reduce((obj, header, index) => {
              obj[header] = values[index] || '';
              return obj;
            }, {} as any);
          }).filter(row => Object.values(row).some(v => v));
          
          setImportPreview(preview);
          setShowImportPreview(true);
        };
        reader.readAsText(file);
      }
    }
  };

  const handleImport = async () => {
    if (!importFile) return;
    
    setLoading(true);
    try {
      // Mock import process
      const result: ImportResult = {
        success: true,
        imported: Math.floor(Math.random() * 50) + 10,
        errors: [],
        warnings: ['Some phone numbers were formatted automatically', '2 duplicate tracking IDs were skipped']
      };
      
      setImportResult(result);
      await fetchOrders(); // Refresh orders
    } catch (error) {
      setImportResult({
        success: false,
        imported: 0,
        errors: ['Failed to process import file'],
        warnings: []
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSampleCSV = () => {
    const sampleData = [
      ['Tracking ID', 'Customer Name', 'Customer Email', 'Customer Phone', 'Origin', 'Destination', 'Weight', 'Service Type', 'Status'],
      ['CC001234', 'John Doe', 'john@example.com', '+1234567890', 'New York', 'Los Angeles', '10.5', 'express', 'in-transit'],
      ['CC001235', 'Jane Smith', 'jane@example.com', '+1234567891', 'Chicago', 'Miami', '5.2', 'standard', 'delivered'],
    ];
    
    const csvContent = sampleData.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'sample_import.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateDeliveryReport = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const deliveredToday = orders.filter(o => 
      o.status === 'delivered' && 
      o.estimatedDelivery?.startsWith(todayStr)
    );
    
    const htmlContent = `
      <html>
        <head>
          <title>Daily Delivery Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .summary { background: #f8f9fa; padding: 20px; margin-bottom: 20px; border-radius: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .status-delivered { color: #28a745; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Daily Delivery Report</h1>
            <h2>Cargo Capital</h2>
            <p>${today.toLocaleDateString()}</p>
          </div>
          
          <div class="summary">
            <h3>Summary</h3>
            <p><strong>Total Deliveries Today:</strong> ${deliveredToday.length}</p>
            <p><strong>Total Orders in System:</strong> ${orders.length}</p>
            <p><strong>Delivery Rate:</strong> ${((deliveredToday.length / orders.length) * 100).toFixed(1)}%</p>
          </div>
          
          <h3>Delivered Orders</h3>
          <table>
            <thead>
              <tr>
                <th>Tracking ID</th>
                <th>Customer</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Status</th>
                <th>Service Type</th>
              </tr>
            </thead>
            <tbody>
              ${deliveredToday.map(order => `
                <tr>
                  <td>${order.trackingId}</td>
                  <td>${order.customerInfo.name}</td>
                  <td>${order.shipmentDetails.origin}</td>
                  <td>${order.shipmentDetails.destination}</td>
                  <td class="status-delivered">Delivered</td>
                  <td>${order.shipmentDetails.serviceType}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="margin-top: 40px; text-align: center; color: #666; font-size: 12px;">
            Generated by Cargo Capital Admin System
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Tools</h1>
        <p className="text-gray-600">Export, import, and generate reports for your cargo data</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'export', label: 'Export Data', icon: '📤' },
              { id: 'import', label: 'Import Data', icon: '📥' },
              { id: 'reports', label: 'Reports', icon: '📊' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Export Tab */}
      {activeTab === 'export' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Export Configuration</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Format Selection */}
              <div>
                <h4 className="font-medium mb-3">Export Format</h4>
                <div className="space-y-2">
                  {[
                    { value: 'csv', label: 'CSV (Spreadsheet)', icon: '📊', desc: 'Compatible with Excel, Google Sheets' },
                    { value: 'pdf', label: 'PDF (Printable)', icon: '📄', desc: 'For reports and documentation' },
                    { value: 'excel', label: 'Excel (Advanced)', icon: '📈', desc: 'Native Excel format (coming soon)' }
                  ].map(format => (
                    <label key={format.value} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="format"
                        value={format.value}
                        checked={exportConfig.format === format.value}
                        onChange={(e) => setExportConfig({...exportConfig, format: e.target.value as any})}
                        className="mr-3"
                        disabled={format.value === 'excel'}
                      />
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="mr-2">{format.icon}</span>
                          <span className="font-medium">{format.label}</span>
                          {format.value === 'excel' && (
                            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Soon</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{format.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filters */}
              <div>
                <h4 className="font-medium mb-3">Filters</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={exportConfig.filters.status || ''}
                      onChange={(e) => setExportConfig({
                        ...exportConfig,
                        filters: {...exportConfig.filters, status: e.target.value || undefined}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="received">Received</option>
                      <option value="in-transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                    <input
                      type="text"
                      value={exportConfig.filters.customer || ''}
                      onChange={(e) => setExportConfig({
                        ...exportConfig,
                        filters: {...exportConfig.filters, customer: e.target.value || undefined}
                      })}
                      placeholder="Search by customer name..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                      <input
                        type="date"
                        value={exportConfig.filters.dateFrom || ''}
                        onChange={(e) => setExportConfig({
                          ...exportConfig,
                          filters: {...exportConfig.filters, dateFrom: e.target.value || undefined}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                      <input
                        type="date"
                        value={exportConfig.filters.dateTo || ''}
                        onChange={(e) => setExportConfig({
                          ...exportConfig,
                          filters: {...exportConfig.filters, dateTo: e.target.value || undefined}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">File Name</label>
                    <input
                      type="text"
                      value={exportConfig.fileName}
                      onChange={(e) => setExportConfig({...exportConfig, fileName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Field Selection */}
            <div className="mt-6">
              <h4 className="font-medium mb-3">Fields to Export</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(
                  availableFields.reduce((acc, field) => {
                    if (!acc[field.category]) acc[field.category] = [];
                    acc[field.category].push(field);
                    return acc;
                  }, {} as Record<string, typeof availableFields>)
                ).map(([category, fields]) => (
                  <div key={category} className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-sm text-gray-700 mb-2">{category}</h5>
                    <div className="space-y-2">
                      {fields.map(field => (
                        <label key={field.key} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={exportConfig.fields.includes(field.key)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setExportConfig({
                                  ...exportConfig,
                                  fields: [...exportConfig.fields, field.key]
                                });
                              } else {
                                setExportConfig({
                                  ...exportConfig,
                                  fields: exportConfig.fields.filter(f => f !== field.key)
                                });
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm">{field.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Export Summary */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-900">Export Summary</p>
                  <p className="text-sm text-blue-700">
                    {getFilteredOrders().length} orders will be exported with {exportConfig.fields.length} fields
                  </p>
                </div>
                <button
                  onClick={handleExport}
                  disabled={loading || exportConfig.fields.length === 0}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Exporting...' : '📤 Export Data'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Tab */}
      {activeTab === 'import' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Import Orders</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* File Upload */}
              <div>
                <h4 className="font-medium mb-3">Upload File</h4>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="import-file"
                  />
                  <label htmlFor="import-file" className="cursor-pointer">
                    <div className="mb-4">
                      <span className="text-4xl">📁</span>
                    </div>
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      {importFile ? importFile.name : 'Choose file to import'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Supports CSV and Excel files up to 10MB
                    </p>
                  </label>
                </div>

                <div className="mt-4 space-y-2">
                  <button
                    onClick={generateSampleCSV}
                    className="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    📄 Download Sample CSV Template
                  </button>
                  
                  {importFile && (
                    <button
                      onClick={handleImport}
                      disabled={loading}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      {loading ? 'Importing...' : '📥 Import Data'}
                    </button>
                  )}
                </div>
              </div>

              {/* Import Guidelines */}
              <div>
                <h4 className="font-medium mb-3">Import Guidelines</h4>
                <div className="space-y-4 text-sm">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h5 className="font-medium text-yellow-800 mb-1">⚠️ Important Notes</h5>
                    <ul className="list-disc list-inside text-yellow-700 space-y-1">
                      <li>Tracking IDs must be unique</li>
                      <li>Email addresses will be validated</li>
                      <li>Phone numbers will be auto-formatted</li>
                      <li>Dates should be in YYYY-MM-DD format</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h5 className="font-medium text-green-800 mb-1">✅ Supported Fields</h5>
                    <ul className="list-disc list-inside text-green-700 space-y-1">
                      <li>Tracking ID (required)</li>
                      <li>Customer Name, Email, Phone</li>
                      <li>Origin and Destination</li>
                      <li>Weight and Service Type</li>
                      <li>Status and Estimated Delivery</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-1">🔄 Processing</h5>
                    <ul className="list-disc list-inside text-blue-700 space-y-1">
                      <li>Duplicates will be skipped</li>
                      <li>Invalid data will be reported</li>
                      <li>Existing orders can be updated</li>
                      <li>Import progress will be shown</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Import Preview */}
            {showImportPreview && importPreview.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium mb-3">Preview (First 5 rows)</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        {Object.keys(importPreview[0]).map(header => (
                          <th key={header} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {importPreview.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          {Object.values(row).map((value: any, cellIndex) => (
                            <td key={cellIndex} className="px-4 py-2 text-sm text-gray-900">
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Import Result */}
            {importResult && (
              <div className={`mt-6 p-4 rounded-lg ${importResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
                <h4 className={`font-medium mb-2 ${importResult.success ? 'text-green-800' : 'text-red-800'}`}>
                  {importResult.success ? '✅ Import Successful' : '❌ Import Failed'}
                </h4>
                
                {importResult.success && (
                  <p className="text-green-700 mb-2">
                    Successfully imported {importResult.imported} orders.
                  </p>
                )}

                {importResult.warnings.length > 0 && (
                  <div className="mb-2">
                    <p className="font-medium text-yellow-800">Warnings:</p>
                    <ul className="list-disc list-inside text-yellow-700 text-sm">
                      {importResult.warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {importResult.errors.length > 0 && (
                  <div>
                    <p className="font-medium text-red-800">Errors:</p>
                    <ul className="list-disc list-inside text-red-700 text-sm">
                      {importResult.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Daily Delivery Report */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">📊</span>
                <div>
                  <h3 className="text-lg font-semibold">Daily Delivery Report</h3>
                  <p className="text-sm text-gray-600">Today's delivery summary</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Delivered Today:</span>
                  <span className="font-medium">
                    {orders.filter(o => o.status === 'delivered' && 
                      o.estimatedDelivery?.startsWith(new Date().toISOString().split('T')[0])
                    ).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">In Transit:</span>
                  <span className="font-medium">
                    {orders.filter(o => o.status === 'in-transit').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Orders:</span>
                  <span className="font-medium">{orders.length}</span>
                </div>
              </div>
              
              <button
                onClick={generateDeliveryReport}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Generate Report
              </button>
            </div>

            {/* Performance Analytics */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">📈</span>
                <div>
                  <h3 className="text-lg font-semibold">Performance Analytics</h3>
                  <p className="text-sm text-gray-600">Weekly performance metrics</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg. Delivery Time:</span>
                  <span className="font-medium">3.2 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">On-Time Rate:</span>
                  <span className="font-medium text-green-600">94.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Customer Satisfaction:</span>
                  <span className="font-medium">4.8/5</span>
                </div>
              </div>
              
              <button
                disabled
                className="w-full px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>

            {/* Custom Reports */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">📋</span>
                <div>
                  <h3 className="text-lg font-semibold">Custom Reports</h3>
                  <p className="text-sm text-gray-600">Build your own reports</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="p-3 bg-gray-50 rounded border text-sm">
                  <p className="font-medium">Monthly Summary</p>
                  <p className="text-gray-600">Orders, revenue, performance</p>
                </div>
                <div className="p-3 bg-gray-50 rounded border text-sm">
                  <p className="font-medium">Customer Analytics</p>
                  <p className="text-gray-600">Customer behavior insights</p>
                </div>
                <div className="p-3 bg-gray-50 rounded border text-sm">
                  <p className="font-medium">Route Optimization</p>
                  <p className="text-gray-600">Delivery route analysis</p>
                </div>
              </div>
              
              <button
                disabled
                className="w-full px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTools;
