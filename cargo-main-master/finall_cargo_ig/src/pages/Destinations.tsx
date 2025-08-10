import React, { useState } from 'react';
import { Search, MapPin, Clock, Plane, Ship, Truck, CheckCircle } from 'lucide-react';

const Destinations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');

  const destinations = [
    {
      country: 'United States',
      region: 'North America',
      flag: '🇺🇸',
      deliveryTime: '3-5 days',
      methods: ['Air', 'Sea'],
      ports: ['New York', 'Los Angeles', 'Chicago'],
      restrictions: 'Electronics require special documentation',
      popular: true
    },
    {
      country: 'United Kingdom',
      region: 'Europe',
      flag: '🇬🇧',
      deliveryTime: '4-6 days',
      methods: ['Air', 'Sea'],
      ports: ['London', 'Manchester', 'Birmingham'],
      restrictions: 'Textile products under 500kg expedited',
      popular: true
    },
    {
      country: 'Germany',
      region: 'Europe',
      flag: '🇩🇪',
      deliveryTime: '4-7 days',
      methods: ['Air', 'Sea', 'Land'],
      ports: ['Frankfurt', 'Hamburg', 'Munich'],
      restrictions: 'Herbal products require phytosanitary certificate',
      popular: true
    },
    {
      country: 'Japan',
      region: 'Asia-Pacific',
      flag: '🇯🇵',
      deliveryTime: '2-4 days',
      methods: ['Air', 'Sea'],
      ports: ['Tokyo', 'Osaka', 'Yokohama'],
      restrictions: 'Handicrafts popular, no wood products',
      popular: true
    },
    {
      country: 'Australia',
      region: 'Asia-Pacific',
      flag: '🇦🇺',
      deliveryTime: '5-8 days',
      methods: ['Air', 'Sea'],
      ports: ['Sydney', 'Melbourne', 'Perth'],
      restrictions: 'Quarantine inspection for organic products',
      popular: true
    },
    {
      country: 'India',
      region: 'South Asia',
      flag: '🇮🇳',
      deliveryTime: '1-3 days',
      methods: ['Air', 'Land'],
      ports: ['Delhi', 'Mumbai', 'Kolkata'],
      restrictions: 'Fast transit, minimal documentation',
      popular: true
    },
    {
      country: 'China',
      region: 'Asia-Pacific',
      flag: '🇨🇳',
      deliveryTime: '3-5 days',
      methods: ['Air', 'Land'],
      ports: ['Beijing', 'Shanghai', 'Guangzhou'],
      restrictions: 'Growing market for Nepali handicrafts',
      popular: false
    },
    {
      country: 'UAE',
      region: 'Middle East',
      flag: '🇦🇪',
      deliveryTime: '2-4 days',
      methods: ['Air'],
      ports: ['Dubai', 'Abu Dhabi'],
      restrictions: 'Hub for further Middle East distribution',
      popular: true
    },
    {
      country: 'Canada',
      region: 'North America',
      flag: '🇨🇦',
      deliveryTime: '4-6 days',
      methods: ['Air', 'Sea'],
      ports: ['Toronto', 'Vancouver', 'Montreal'],
      restrictions: 'Strong Nepali diaspora market',
      popular: false
    },
    {
      country: 'France',
      region: 'Europe',
      flag: '🇫🇷',
      deliveryTime: '4-7 days',
      methods: ['Air', 'Sea'],
      ports: ['Paris', 'Lyon', 'Marseille'],
      restrictions: 'Luxury handicrafts in high demand',
      popular: false
    },
    {
      country: 'South Korea',
      region: 'Asia-Pacific',
      flag: '🇰🇷',
      deliveryTime: '3-5 days',
      methods: ['Air', 'Sea'],
      ports: ['Seoul', 'Busan'],
      restrictions: 'Growing interest in Himalayan products',
      popular: false
    },
    {
      country: 'Singapore',
      region: 'Asia-Pacific',
      flag: '🇸🇬',
      deliveryTime: '2-3 days',
      methods: ['Air'],
      ports: ['Singapore'],
      restrictions: 'Gateway to Southeast Asia',
      popular: false
    }
  ];

  const regions = ['All', 'Asia-Pacific', 'Europe', 'North America', 'Middle East', 'South Asia'];

  const filteredDestinations = destinations.filter(destination => {
    const matchesSearch = destination.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         destination.ports.some(port => port.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRegion = selectedRegion === 'All' || destination.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const popularDestinations = destinations.filter(dest => dest.popular);

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'Air': return <Plane className="h-4 w-4" />;
      case 'Sea': return <Ship className="h-4 w-4" />;
      case 'Land': return <Truck className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="text-white py-20" style={{ background: 'linear-gradient(to right, #0096C7, #007bb3)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Global Destinations
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              We connect Nepal to over 50 countries worldwide. Find your destination 
              and discover our shipping options, delivery times, and special requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations or cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-2"
                style={{ 
                  focusRingColor: '#F9B222',
                  focusBorderColor: '#F9B222'
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    selectedRegion === region
                      ? 'text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: selectedRegion === region ? '#F9B222' : '#FFFFFF',
                    border: selectedRegion === region ? 'none' : '1px solid #e5e7eb'
                  }}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0096C7' }}>
              Popular Destinations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our most frequently shipped destinations with the highest demand for Nepali products
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {popularDestinations.map((destination, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{destination.flag}</span>
                      <h3 className="text-xl font-semibold" style={{ color: '#0096C7' }}>{destination.country}</h3>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: '#F9B222', color: 'white' }}>
                      Popular
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Delivery: {destination.deliveryTime}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {destination.ports.slice(0, 2).join(', ')}
                        {destination.ports.length > 2 && ` +${destination.ports.length - 2} more`}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Methods:</span>
                      <div className="flex space-x-2">
                        {destination.methods.map((method, methodIndex) => (
                          <div key={methodIndex} className="flex items-center space-x-1 px-2 py-1 rounded text-xs bg-gray-100" style={{ color: '#0096C7' }}>
                            {getMethodIcon(method)}
                            <span>{method}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-3 bg-orange-50" style={{ borderColor: '#F9B222' }}>
                      <p className="text-xs" style={{ color: '#0096C7' }}>{destination.restrictions}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Destinations */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0096C7' }}>
              All Destinations
            </h2>
            <p className="text-lg text-gray-600">
              Complete list of countries we serve with detailed shipping information
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredDestinations.map((destination, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{destination.flag}</span>
                    <div>
                      <h3 className="text-lg font-semibold" style={{ color: '#0096C7' }}>{destination.country}</h3>
                      <p className="text-sm text-gray-500">{destination.region}</p>
                    </div>
                  </div>
                  {destination.popular && (
                    <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: '#F9B222', color: 'white' }}>
                      Popular
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium" style={{ color: '#0096C7' }}>Delivery Time</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-6">{destination.deliveryTime}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium" style={{ color: '#0096C7' }}>Major Cities</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-6">{destination.ports.join(', ')}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium" style={{ color: '#0096C7' }}>Shipping Methods:</span>
                  </div>
                  <div className="flex space-x-2">
                    {destination.methods.map((method, methodIndex) => (
                      <div key={methodIndex} className="flex items-center space-x-1 px-3 py-1 rounded-full text-sm bg-gray-100" style={{ color: '#0096C7' }}>
                        {getMethodIcon(method)}
                        <span>{method}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 rounded-lg p-3 bg-gray-50">
                  <p className="text-xs" style={{ color: '#0096C7' }}>{destination.restrictions}</p>
                </div>
              </div>
            ))}
          </div>
          
          {filteredDestinations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No destinations found matching your search criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Service Areas Map */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0096C7' }}>
              Global Service Coverage
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our comprehensive network ensures your cargo reaches its destination safely and on time
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: '#F9B222' }}>
                  <span className="text-2xl">🌏</span>
                </div>
                <h3 className="text-xl font-semibold" style={{ color: '#0096C7' }}>Asia-Pacific</h3>
                <p className="text-gray-600">15 Countries</p>
              </div>
              
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: '#F9B222' }}>
                  <span className="text-2xl">🌍</span>
                </div>
                <h3 className="text-xl font-semibold" style={{ color: '#0096C7' }}>Europe</h3>
                <p className="text-gray-600">20 Countries</p>
              </div>
              
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: '#F9B222' }}>
                  <span className="text-2xl">🌎</span>
                </div>
                <h3 className="text-xl font-semibold" style={{ color: '#0096C7' }}>Americas</h3>
                <p className="text-gray-600">8 Countries</p>
              </div>
              
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: '#F9B222' }}>
                  <span className="text-2xl">🌍</span>
                </div>
                <h3 className="text-xl font-semibold" style={{ color: '#0096C7' }}>Middle East & Africa</h3>
                <p className="text-gray-600">7 Countries</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Destinations;