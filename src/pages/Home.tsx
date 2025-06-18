import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package, Truck, Plane, Ship, Shield, Clock, Users, CheckCircle } from 'lucide-react';
import Globe3D from '../components/Globe3D';

const Home = () => {
  const stats = [
    { number: '10,000+', label: 'Successful Deliveries', icon: Package },
    { number: '50+', label: 'Countries Served', icon: Users },
    { number: '24/7', label: 'Customer Support', icon: Clock },
    { number: '99.9%', label: 'Delivery Success Rate', icon: CheckCircle },
  ];

  const services = [
    {
      icon: Plane,
      title: 'Air Cargo',
      description: 'Fast and reliable air freight services worldwide',
      color: 'bg-blue-500',
    },
    {
      icon: Ship,
      title: 'Sea Freight',
      description: 'Cost-effective ocean shipping for bulk cargo',
      color: 'bg-teal-500',
    },
    {
      icon: Truck,
      title: 'Land Transport',
      description: 'Efficient overland delivery across borders',
      color: 'bg-green-500',
    },
    {
      icon: Shield,
      title: 'Customs Clearance',
      description: 'Expert handling of all customs procedures',
      color: 'bg-purple-500',
    },
  ];

  const nepalExports = [
    { name: 'Handwoven Carpets', image: 'https://images.pexels.com/photos/6283968/pexels-photo-6283968.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Pashmina Shawls', image: 'https://images.pexels.com/photos/7648047/pexels-photo-7648047.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Himalayan Tea', image: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Medicinal Herbs', image: 'https://images.pexels.com/photos/4123897/pexels-photo-4123897.jpeg?auto=compress&cs=tinysrgb&w=300' },
  ];

  return (
    <div className="space-y-0">
      {/* Hero Section with 3D Globe */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Connecting Nepal to the 
                <span className="text-red-400"> World</span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Reliable cargo services from the heart of the Himalayas to every corner of the globe. 
                Your trusted partner for international logistics and freight forwarding.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/quote"
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Get Quote</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/tracking"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Track Cargo</span>
                  <Package className="h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <Globe3D />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-blue-50 group-hover:bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 transition-colors duration-200">
                  <stat.icon className="h-8 w-8 text-blue-800" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Logistics Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive cargo solutions tailored to meet your shipping needs across the globe
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                <div className={`${service.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <service.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nepal Exports Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Premium Nepali Products We Export
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Showcasing Nepal's finest craftsmanship and natural treasures to the world
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {nepalExports.map((product, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 text-center">{product.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Ship Your Cargo?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Get started with a free quote or track your existing shipment. 
            Our team is ready to help you navigate global logistics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/quote"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <span>Request Quote</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-lg font-semibold transition-colors duration-200"
            >
              Contact Us Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;