import React, { useState, useEffect } from 'react';

interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'super-admin' | 'editor' | 'viewer';
  avatar?: string;
  lastLogin: string;
  isActive: boolean;
  permissions: string[];
  createdAt: string;
}

interface AuditLogEntry {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const AdminManagement: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'admins' | 'audit' | 'permissions'>('admins');
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [auditFilters, setAuditFilters] = useState({
    adminId: '',
    action: '',
    severity: '',
    dateFrom: '',
    dateTo: '',
    resource: ''
  });

  // Available permissions
  const availablePermissions = [
    { id: 'orders.view', name: 'View Orders', category: 'Orders' },
    { id: 'orders.create', name: 'Create Orders', category: 'Orders' },
    { id: 'orders.edit', name: 'Edit Orders', category: 'Orders' },
    { id: 'orders.delete', name: 'Delete Orders', category: 'Orders' },
    { id: 'orders.status', name: 'Update Status', category: 'Orders' },
    { id: 'customers.view', name: 'View Customers', category: 'Customers' },
    { id: 'customers.edit', name: 'Edit Customers', category: 'Customers' },
    { id: 'reports.view', name: 'View Reports', category: 'Reports' },
    { id: 'reports.export', name: 'Export Data', category: 'Reports' },
    { id: 'admin.manage', name: 'Manage Admins', category: 'Administration' },
    { id: 'system.config', name: 'System Configuration', category: 'Administration' }
  ];

  // Role configurations
  const roleConfigs = {
    'super-admin': {
      name: 'Super Admin',
      color: 'bg-red-100 text-red-800',
      icon: '👑',
      description: 'Full system access',
      permissions: availablePermissions.map(p => p.id)
    },
    'editor': {
      name: 'Editor',
      color: 'bg-blue-100 text-blue-800',
      icon: '✏️',
      description: 'Can create and edit orders',
      permissions: ['orders.view', 'orders.create', 'orders.edit', 'orders.status', 'customers.view', 'customers.edit', 'reports.view']
    },
    'viewer': {
      name: 'Viewer',
      color: 'bg-green-100 text-green-800',
      icon: '👁️',
      description: 'Read-only access',
      permissions: ['orders.view', 'customers.view', 'reports.view']
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Mock admin data
      const mockAdmins: Admin[] = [
        {
          id: '1',
          name: 'John Admin',
          email: 'john@cargocapital.com',
          role: 'super-admin',
          lastLogin: new Date(Date.now() - 3600000).toISOString(),
          isActive: true,
          permissions: roleConfigs['super-admin'].permissions,
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          name: 'Sarah Manager',
          email: 'sarah@cargocapital.com',
          role: 'editor',
          lastLogin: new Date(Date.now() - 7200000).toISOString(),
          isActive: true,
          permissions: roleConfigs['editor'].permissions,
          createdAt: '2024-02-20T14:15:00Z'
        },
        {
          id: '3',
          name: 'Mike Viewer',
          email: 'mike@cargocapital.com',
          role: 'viewer',
          lastLogin: new Date(Date.now() - 86400000).toISOString(),
          isActive: false,
          permissions: roleConfigs['viewer'].permissions,
          createdAt: '2024-03-10T09:45:00Z'
        }
      ];

      // Mock audit log data
      const mockAuditLogs: AuditLogEntry[] = [
        {
          id: '1',
          adminId: '1',
          adminName: 'John Admin',
          action: 'Order Status Updated',
          resource: 'Order',
          resourceId: 'CC001234',
          details: 'Changed status from "In Transit" to "Delivered"',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          severity: 'low'
        },
        {
          id: '2',
          adminId: '2',
          adminName: 'Sarah Manager',
          action: 'Order Created',
          resource: 'Order',
          resourceId: 'CC001235',
          details: 'New order created for customer John Doe',
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          severity: 'low'
        },
        {
          id: '3',
          adminId: '1',
          adminName: 'John Admin',
          action: 'Admin Role Changed',
          resource: 'Admin',
          resourceId: '3',
          details: 'Changed Mike Viewer role from Editor to Viewer',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          severity: 'high'
        },
        {
          id: '4',
          adminId: '1',
          adminName: 'John Admin',
          action: 'Login Failed',
          resource: 'Authentication',
          resourceId: 'login_attempt',
          details: 'Failed login attempt with invalid credentials',
          ipAddress: '203.0.113.1',
          userAgent: 'Unknown',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          severity: 'medium'
        }
      ];

      setAdmins(mockAdmins);
      setAuditLogs(mockAuditLogs);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (adminId: string, newRole: Admin['role']) => {
    setAdmins(admins.map(admin => 
      admin.id === adminId 
        ? { ...admin, role: newRole, permissions: roleConfigs[newRole].permissions }
        : admin
    ));

    // Add audit log entry
    const auditEntry: AuditLogEntry = {
      id: Date.now().toString(),
      adminId: '1', // Current admin (would be from auth context)
      adminName: 'Current Admin',
      action: 'Admin Role Changed',
      resource: 'Admin',
      resourceId: adminId,
      details: `Changed admin role to ${newRole}`,
      ipAddress: '192.168.1.100',
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      severity: 'high'
    };
    setAuditLogs([auditEntry, ...auditLogs]);
  };

  const handleToggleAdmin = (adminId: string) => {
    setAdmins(admins.map(admin => 
      admin.id === adminId 
        ? { ...admin, isActive: !admin.isActive }
        : admin
    ));

    // Add audit log entry
    const admin = admins.find(a => a.id === adminId);
    const auditEntry: AuditLogEntry = {
      id: Date.now().toString(),
      adminId: '1',
      adminName: 'Current Admin',
      action: admin?.isActive ? 'Admin Deactivated' : 'Admin Activated',
      resource: 'Admin',
      resourceId: adminId,
      details: `Admin account ${admin?.isActive ? 'deactivated' : 'activated'}`,
      ipAddress: '192.168.1.100',
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      severity: 'medium'
    };
    setAuditLogs([auditEntry, ...auditLogs]);
  };

  const getSeverityColor = (severity: string): string => {
    const colors = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-orange-100 text-orange-800',
      'critical': 'bg-red-100 text-red-800'
    };
    return colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getSeverityIcon = (severity: string): string => {
    const icons = {
      'low': '🟢',
      'medium': '🟡',
      'high': '🟠',
      'critical': '🔴'
    };
    return icons[severity as keyof typeof icons] || '⚪';
  };

  const getFilteredAuditLogs = () => {
    return auditLogs.filter(log => {
      if (auditFilters.adminId && log.adminId !== auditFilters.adminId) return false;
      if (auditFilters.action && !log.action.toLowerCase().includes(auditFilters.action.toLowerCase())) return false;
      if (auditFilters.severity && log.severity !== auditFilters.severity) return false;
      if (auditFilters.resource && !log.resource.toLowerCase().includes(auditFilters.resource.toLowerCase())) return false;
      if (auditFilters.dateFrom && new Date(log.timestamp) < new Date(auditFilters.dateFrom)) return false;
      if (auditFilters.dateTo && new Date(log.timestamp) > new Date(auditFilters.dateTo)) return false;
      return true;
    });
  };

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Management</h1>
        <p className="text-gray-600">Manage administrators, roles, and system access</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'admins', label: 'Administrators', icon: '👥' },
              { id: 'audit', label: 'Audit Trail', icon: '📋' },
              { id: 'permissions', label: 'Permissions', icon: '🔐' }
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

      {/* Administrators Tab */}
      {activeTab === 'admins' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Administrators</h2>
            <button
              onClick={() => setShowAddAdmin(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Add Administrator
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Administrator
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {admins.map(admin => (
                    <tr key={admin.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {admin.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                            <div className="text-sm text-gray-500">{admin.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={admin.role}
                          onChange={(e) => handleRoleChange(admin.id, e.target.value as Admin['role'])}
                          className={`px-2 py-1 text-xs font-medium rounded-full border-0 ${roleConfigs[admin.role].color}`}
                        >
                          {Object.entries(roleConfigs).map(([key, config]) => (
                            <option key={key} value={key}>
                              {config.icon} {config.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(admin.lastLogin).toLocaleDateString()} {new Date(admin.lastLogin).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          admin.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {admin.isActive ? '✅ Active' : '❌ Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedAdmin(admin)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Edit Admin"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleToggleAdmin(admin.id)}
                            className={`transition-colors ${
                              admin.isActive 
                                ? 'text-red-600 hover:text-red-900' 
                                : 'text-green-600 hover:text-green-900'
                            }`}
                            title={admin.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {admin.isActive ? '🚫' : '✅'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Audit Trail Tab */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Audit Trail</h2>
          
          {/* Audit Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Administrator</label>
                <select
                  value={auditFilters.adminId}
                  onChange={(e) => setAuditFilters({...auditFilters, adminId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">All Administrators</option>
                  {admins.map(admin => (
                    <option key={admin.id} value={admin.id}>{admin.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                <input
                  type="text"
                  value={auditFilters.action}
                  onChange={(e) => setAuditFilters({...auditFilters, action: e.target.value})}
                  placeholder="Search actions..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                <select
                  value={auditFilters.severity}
                  onChange={(e) => setAuditFilters({...auditFilters, severity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">All Severities</option>
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🟠 High</option>
                  <option value="critical">🔴 Critical</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                <input
                  type="date"
                  value={auditFilters.dateFrom}
                  onChange={(e) => setAuditFilters({...auditFilters, dateFrom: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                <input
                  type="date"
                  value={auditFilters.dateTo}
                  onChange={(e) => setAuditFilters({...auditFilters, dateTo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resource</label>
                <input
                  type="text"
                  value={auditFilters.resource}
                  onChange={(e) => setAuditFilters({...auditFilters, resource: e.target.value})}
                  placeholder="Order, Admin, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Audit Log Table */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resource
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Severity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getFilteredAuditLogs().map(log => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          {new Date(log.timestamp).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{log.adminName}</div>
                        <div className="text-xs text-gray-500">{log.ipAddress}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.action}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{log.resource}</div>
                        <div className="text-xs text-gray-500">{log.resourceId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(log.severity)}`}>
                          {getSeverityIcon(log.severity)} {log.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Tab */}
      {activeTab === 'permissions' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Role Permissions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(roleConfigs).map(([roleKey, roleConfig]) => (
              <div key={roleKey} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">{roleConfig.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold">{roleConfig.name}</h3>
                    <p className="text-sm text-gray-600">{roleConfig.description}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {Object.entries(
                    availablePermissions.reduce((acc, perm) => {
                      if (!acc[perm.category]) acc[perm.category] = [];
                      acc[perm.category].push(perm);
                      return acc;
                    }, {} as Record<string, typeof availablePermissions>)
                  ).map(([category, perms]) => (
                    <div key={category}>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">{category}</h4>
                      <div className="space-y-1">
                        {perms.map(perm => (
                          <div key={perm.id} className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 ${
                              roleConfig.permissions.includes(perm.id) 
                                ? 'bg-green-500' 
                                : 'bg-gray-300'
                            }`}></div>
                            <span className={`text-xs ${
                              roleConfig.permissions.includes(perm.id) 
                                ? 'text-gray-900' 
                                : 'text-gray-500'
                            }`}>
                              {perm.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
