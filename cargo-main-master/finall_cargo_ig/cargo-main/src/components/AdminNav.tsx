import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Import admin components
import UnifiedAdminPanel from '../pages/UnifiedAdminPanel';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  avatar?: string;
}

interface AdminNavProps {
  currentUser?: AdminUser;
  onLogout?: () => void;
}

const AdminNav: React.FC<AdminNavProps> = ({ 
  currentUser = {
    id: '1',
    name: 'Admin User',
    email: 'admin@cargocapital.com',
    role: 'admin',
    avatar: 'AU'
  },
  onLogout
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const getRoleBadgeColor = (role: string) => {
    return 'bg-blue-100 text-blue-800';
  };

  const formatRole = (role: string) => {
    return 'Admin';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-80' : 'w-20'} bg-white shadow-xl transition-all duration-300 flex flex-col border-r border-gray-200`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${!isSidebarOpen && 'justify-center'}`}>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                CC
              </div>
              {isSidebarOpen && (
                <div className="ml-4">
                  <h1 className="text-xl font-bold text-gray-900">Cargo Capital</h1>
                  <p className="text-sm text-blue-600 font-medium">Admin Panel</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
            >
              {isSidebarOpen ? '◀' : '▶'}
            </button>
          </div>
        </div>

        {/* Welcome Message */}
        {isSidebarOpen && (
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
            <p className="text-sm text-blue-800 font-medium">
              Welcome back, {currentUser.name.split(' ')[0]}! 👋
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Manage your cargo operations
            </p>
          </div>
        )}

        {/* User Profile */}
        <div className="mt-auto p-6 border-t border-gray-100 bg-gray-50">
          <div className={`flex items-center ${!isSidebarOpen && 'justify-center'}`}>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              {currentUser.avatar || currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            {isSidebarOpen && (
              <div className="ml-3 flex-1">
                <p className="font-semibold text-gray-900">{currentUser.name}</p>
                <p className="text-sm text-gray-600">{currentUser.email}</p>
                <span className="inline-block px-3 py-1 text-xs rounded-full mt-2 bg-blue-100 text-blue-800 font-medium">
                  {formatRole(currentUser.role)}
                </span>
              </div>
            )}
          </div>
          
          {isSidebarOpen && (
            <div className="mt-4 space-y-1">
              <button
                onClick={() => {/* Handle profile settings */}}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200 flex items-center"
              >
                <span className="mr-2">⚙️</span>
                Settings
              </button>
              <button
                onClick={() => {/* Handle help */}}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-200 flex items-center"
              >
                <span className="mr-2">❓</span>
                Help & Support
              </button>
              <button
                onClick={onLogout}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:shadow-sm rounded-lg transition-all duration-200 flex items-center"
              >
                <span className="mr-2">🚪</span>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Page Title */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h2>
              <p className="text-gray-600 mt-1 text-lg">
                Complete cargo management system
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-6">
              {/* Time Display */}
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <span>🕐</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-full border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-700 font-medium">System Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <UnifiedAdminPanel />
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminNav;
