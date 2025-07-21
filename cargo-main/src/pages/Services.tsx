import React from 'react';
import { Plane, Ship, Truck, Shield, Home, Clock, Globe, CheckCircle, ArrowRight } from 'lucide-react';

const Services = () => {
  const mainServices = [
    {
      icon: Plane,
      title: 'Air Cargo',
      description: 'Fast and reliable air freight services for time-sensitive shipments',
      features: [
        'Express delivery (1-3 days)',
        'Door-to-door service',
        'Real-time tracking',
        'Temperature-controlled options',
        'Dangerous goods handling'
      ],
      regions: 'USA, Europe, Asia-Pacific, Middle East',
      image: 'https://images.pexels.com/photos/62623/wing-plane-flying-airplane-62623.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Ship,
      title: 'Sea Freight',
      description: 'Cost-effective ocean shipping solutions for bulk cargo',
      features: [
        'Full Container Load (FCL)',
        'Less Container Load (LCL)',
        'Roll-on/Roll-off service',
        'Breakbulk cargo',
        'Project cargo handling'
      ],
      regions: 'Global ports via India gateway',
      image: 'https://images.pexels.com/photos/906982/pexels-photo-906982.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Truck,
      title: 'Land Transport',
      description: 'Efficient overland delivery across South Asian borders',
      features: [
        'Cross-border trucking',
        'Last-mile delivery',
        'Multi-modal transport',
        'Specialized vehicle fleet',
        'Border clearance expertise'
      ],
      regions: 'India, China, Bangladesh',
      image: 'https://images.pexels.com/photos/1095814/pexels-photo-1095814.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Shield,
      title: 'Customs Clearance',
      description: 'Expert customs brokerage and documentation services',
      features: [
        'Import/Export documentation',
        'Duty calculation',
        'Compliance management',
        'Government liaison',
        'Regulatory updates'
      ],
      regions: 'All international destinations',
      image: 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Home,
      title: 'Door-to-Door Service',
      description: 'Complete logistics solution from pickup to final delivery',
      features: [
        'Pickup scheduling',
        'Packaging services',
        'Complete documentation',
        'Insurance options',
        'Delivery confirmation'
      ],
      regions: 'Available for all destinations',
      image: 'https://images.pexels.com/photos/4481532/pexels-photo-4481532.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  const specializedServices = [
    {
      title: 'Handicraft Exports',
      description: 'Specialized handling of traditional Nepali crafts and artwork',
      icon: '🎨'
    },
    {
      title: 'Textile & Garments',
      description: 'Expert care for pashmina, carpets, and clothing exports',
      icon: '🧵'
    },
    {
      title: 'Medicinal Herbs',
      description: 'Temperature-controlled transport for herbal products',
      icon: '🌿'
    },
    {
      title: 'Tea & Spices',
      description: 'Quality preservation for Himalayan tea and spices',
      icon: '🍃'
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="text-white py-20" style={{ background: '#0091c3' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Logistics Services
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Comprehensive cargo solutions designed to meet every shipping need, 
              from small parcels to large industrial shipments.
            </p>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {mainServices.map((service, index) => (
              <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="flex items-center space-x-4">
                    <div className="rounded-lg w-12 h-12 flex items-center justify-center" style={{ backgroundColor: '#f9b222' }}>
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold" style={{ color: '#1a1a1a' }}>{service.title}</h2>
                  </div>
                  
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3" style={{ color: '#1a1a1a' }}>Key Features:</h3>
                    <ul className="space-y-2">
                      {service.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 flex-shrink-0" style={{ color: '#f9b222' }} />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <img
                    src={service.image}
                    alt={service.title}
                    className="rounded-xl shadow-xl w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 opacity-10 rounded-xl" style={{ backgroundColor: '#1a1a1a' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialized Services */}
      <section className="py-16" style={{ backgroundColor: '#f6f6f6' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#1a1a1a' }}>
              Specialized Nepal Exports
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We understand the unique requirements of Nepal's traditional products and exports
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {specializedServices.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: '#1a1a1a' }}>{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#1a1a1a' }}>
              Our Service Process
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple, transparent steps from booking to delivery
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Book & Quote', description: 'Get instant quote and book your shipment online' },
              { step: '02', title: 'Pickup', description: 'We collect your cargo from your location' },
              { step: '03', title: 'Processing', description: 'Documentation, customs clearance, and shipping' },
              { step: '04', title: 'Delivery', description: 'Safe delivery to final destination with tracking' }
            ].map((process, index) => (
              <div key={index} className="text-center relative group">
                <div className="text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 transition-colors duration-200" style={{ backgroundColor: '#f9b222' }}>
                  <span className="text-xl font-bold">{process.step}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#1a1a1a' }}>{process.title}</h3>
                <p className="text-gray-600 text-sm">{process.description}</p>
                {index < 3 && (
                  <ArrowRight className="hidden lg:block absolute top-8 -right-4 h-6 w-6 text-gray-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-white" style={{ background: '#0091c3' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need a Custom Solution?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Every business has unique logistics needs. Let us create a tailored solution for your cargo requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/quote"
              className="text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
              style={{ backgroundColor: '#f9b222' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6a01e'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f9b222'}
            >
              <span>Get Custom Quote</span>
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white hover:bg-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200"
              style={{ ':hover': { color: '#1a1a1a' } }}
            >
              Speak with Expert
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;