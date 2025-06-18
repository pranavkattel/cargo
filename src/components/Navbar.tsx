import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Phone } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Destinations', href: '/destinations' },
    { name: 'Tracking', href: '/tracking' },
    { name: 'Quote', href: '/quote' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-blue-800" />
              <span className="text-xl font-bold text-gray-900">
                Nepal<span className="text-red-600">Cargo</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.href
                    ? 'text-blue-800 border-b-2 border-blue-800'
                    : 'text-gray-700 hover:text-blue-800'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center space-x-2 text-blue-800">
              <Phone className="h-4 w-4" />
              <span className="text-sm font-medium">+977-1-4444-555</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-800 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                  location.pathname === item.href
                    ? 'text-blue-800 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-800 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-3 py-2 flex items-center space-x-2 text-blue-800">
              <Phone className="h-4 w-4" />
              <span className="text-sm font-medium">+977-1-4444-555</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;