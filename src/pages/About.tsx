import React from 'react';
import { Shield, Award, Users, Globe, CheckCircle, Target, Heart, Zap } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Shield,
      title: 'Trust & Reliability',
      description: 'We handle your cargo with the utmost care and ensure secure delivery every time.',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Connecting Nepal to over 50 countries worldwide with our extensive network.',
    },
    {
      icon: Zap,
      title: 'Efficiency',
      description: 'Streamlined processes and modern technology for faster, more efficient service.',
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We go above and beyond for every client.',
    },
  ];

  const milestones = [
    { year: '2010', event: 'Founded NepalCargo with a vision to connect Nepal globally' },
    { year: '2015', event: 'Expanded to 25 international destinations' },
    { year: '2018', event: 'Achieved 10,000+ successful deliveries milestone' },
    { year: '2020', event: 'Launched digital tracking system and online booking' },
    { year: '2022', event: 'Reached 50+ countries and won Excellence in Logistics Award' },
    { year: '2024', event: 'Celebrating 14 years of connecting Nepal to the world' },
  ];

  const certifications = [
    'ISO 9001:2015 Quality Management',
    'IATA Cargo Agent Certification',
    'Nepal Freight Forwarders Association Member',
    'International Chamber of Commerce',
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="text-white py-20" style={{ background: 'linear-gradient(to right, #0096C7, #007bb3)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Capital Cargo
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              For over a decade, we've been Nepal's trusted partner in international logistics, 
              connecting the heart of the Himalayas to markets around the world.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Target className="h-8 w-8" style={{ color: '#F9B222' }} />
                <h2 className="text-3xl font-bold" style={{ color: '#0096C7' }}>Our Mission</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                To bridge Nepal with the global marketplace through reliable, efficient, and 
                innovative cargo services. We are committed to supporting Nepal's economic growth 
                by enabling seamless international trade and commerce.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Globe className="h-8 w-8" style={{ color: '#F9B222' }} />
                <h2 className="text-3xl font-bold" style={{ color: '#0096C7' }}>Our Vision</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                To be recognized as the leading logistics partner for Nepal, facilitating 
                the country's integration into the global economy while preserving and promoting 
                our rich cultural heritage through international trade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0096C7' }}>
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Capital Cargo
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gray-50">
                  <value.icon className="h-8 w-8" style={{ color: '#F9B222' }} />
                </div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: '#0096C7' }}>{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0096C7' }}>
              Our Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Key milestones in our mission to connect Nepal with the world
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-0.5 h-full w-0.5 bg-gray-200"></div>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="flex-1 pr-8">
                    {index % 2 === 0 && (
                      <div className="bg-white rounded-lg shadow-lg p-6 text-right">
                        <div className="text-2xl font-bold mb-2" style={{ color: '#F9B222' }}>{milestone.year}</div>
                        <p className="text-gray-600">{milestone.event}</p>
                      </div>
                    )}
                  </div>
                  <div className="relative flex items-center justify-center w-4 h-4 rounded-full z-10" style={{ backgroundColor: '#F9B222' }}>
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="flex-1 pl-8">
                    {index % 2 === 1 && (
                      <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="text-2xl font-bold mb-2" style={{ color: '#F9B222' }}>{milestone.year}</div>
                        <p className="text-gray-600">{milestone.event}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0096C7' }}>
              Certifications & Partnerships
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our commitment to excellence is recognized by industry leaders
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4">
                <div className="rounded-full p-2 bg-gray-50">
                  <CheckCircle className="h-6 w-6" style={{ color: '#F9B222' }} />
                </div>
                <span className="font-medium" style={{ color: '#0096C7' }}>{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#0096C7' }}>
                Why Choose Capital Cargo?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 mt-1 flex-shrink-0" style={{ color: '#F9B222' }} />
                  <div>
                    <h3 className="font-semibold" style={{ color: '#0096C7' }}>Local Expertise, Global Reach</h3>
                    <p className="text-gray-600">Deep understanding of Nepali markets combined with international logistics expertise.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 mt-1 flex-shrink-0" style={{ color: '#F9B222' }} />
                  <div>
                    <h3 className="font-semibold" style={{ color: '#0096C7' }}>Specialized in Nepali Products</h3>
                    <p className="text-gray-600">Expert handling of traditional crafts, textiles, herbs, and specialty items from Nepal.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 mt-1 flex-shrink-0" style={{ color: '#F9B222' }} />
                  <div>
                    <h3 className="font-semibold" style={{ color: '#0096C7' }}>End-to-End Solutions</h3>
                    <p className="text-gray-600">From pickup to delivery, including customs clearance and documentation.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 mt-1 flex-shrink-0" style={{ color: '#F9B222' }} />
                  <div>
                    <h3 className="font-semibold" style={{ color: '#0096C7' }}>Technology-Driven Service</h3>
                    <p className="text-gray-600">Modern tracking systems and digital platforms for seamless experience.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/586744/pexels-photo-586744.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Cargo Operations"
                className="rounded-xl shadow-xl"
              />
              <div className="absolute inset-0 opacity-10 rounded-xl" style={{ backgroundColor: '#0096C7' }}></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;