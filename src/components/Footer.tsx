import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import logo from '../assets/images/logo.jpg';

const Footer = () => {
  return (
    <footer className="text-white w-full" style={{ backgroundColor: '#0096C7' }}>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <img 
                src={logo} 
                alt="Capital Cargo Logo" 
                className="h-16 max-w-full object-contain" 
              />
            </div>
            <p className="text-blue-100 text-sm">
              Connecting Nepal to the world with reliable, efficient, and secure cargo services. 
              Your trusted partner for international logistics.
            </p>
            <div className="flex justify-center space-x-4">
              <Facebook className="h-5 w-5 text-blue-200 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-blue-200 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-blue-200 hover:text-white cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-blue-200 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/about" className="block text-blue-100 hover:text-white transition-colors text-sm">About Us</Link>
              <Link to="/services" className="block text-blue-100 hover:text-white transition-colors text-sm">Services</Link>
              <Link to="/destinations" className="block text-blue-100 hover:text-white transition-colors text-sm">Destinations</Link>
              <Link to="/tracking" className="block text-blue-100 hover:text-white transition-colors text-sm">Track Cargo</Link>
              <Link to="/quote" className="block text-blue-100 hover:text-white transition-colors text-sm">Get Quote</Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Our Services</h3>
            <div className="space-y-2">
              <p className="text-blue-100 text-sm">Air Cargo</p>
              <p className="text-blue-100 text-sm">Sea Freight</p>
              <p className="text-blue-100 text-sm">Land Transport</p>
              <p className="text-blue-100 text-sm">Customs Clearance</p>
              <p className="text-blue-100 text-sm">Door-to-Door</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-3">
                <MapPin className="h-4 w-4 flex-shrink-0" style={{ color: '#F9B222' }} />
                <span className="text-blue-100 text-sm">Thamel, Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Phone className="h-4 w-4 flex-shrink-0" style={{ color: '#F9B222' }} />
                <span className="text-blue-100 text-sm">+977-1-4444-555</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Mail className="h-4 w-4 flex-shrink-0" style={{ color: '#F9B222' }} />
                <span className="text-blue-100 text-sm">info@capitalcargo.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-400 mt-8 pt-8 text-center">
          <p className="text-blue-200 text-sm">
            © 2024 Capital Cargo. All rights reserved. | Connecting Nepal to the World
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;