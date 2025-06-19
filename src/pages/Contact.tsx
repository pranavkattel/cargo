import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    service: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Our Office',
      details: ['Thamel, Kathmandu 44600', 'Nepal'],
      color: 'text-blue-600'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+977-1-4444-555', '+977-1-4444-556'],
      color: 'text-green-600'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['info@nepalcargo.com', 'support@nepalcargo.com'],
      color: 'text-purple-600'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat: 9:00 AM - 4:00 PM'],
      color: 'text-orange-600'
    }
  ];

  const services = [
    'Air Cargo',
    'Sea Freight',
    'Land Transport',
    'Customs Clearance',
    'Warehousing',
    'Door-to-Door Service',
    'Insurance',
    'Other'
  ];

  if (isSubmitted) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f6f6f6' }}>
        <div className="max-w-md mx-auto text-center bg-white rounded-xl shadow-lg p-8">
          <CheckCircle className="h-16 w-16 mx-auto mb-4" style={{ color: '#f9b222' }} />
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a1a' }}>Message Sent!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for contacting us. We'll get back to you within 24 hours.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            style={{ backgroundColor: '#f9b222' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6a01e'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f9b222'}
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="text-white py-20" style={{ background: 'linear-gradient(to right, #1a1a1a, #2d2d2d)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Ready to ship your cargo? Have questions about our services? 
              Get in touch with our expert team for personalized assistance.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="text-center group">
                <div className="rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 transition-colors duration-200" style={{ backgroundColor: '#f6f6f6' }}>
                  <info.icon className={`h-8 w-8`} style={{ color: '#f9b222' }} />
                </div>
                <h3 className="text-lg font-semibold mb-3" style={{ color: '#1a1a1a' }}>{info.title}</h3>
                <div className="space-y-1">
                  {info.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="text-gray-600">{detail}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16" style={{ backgroundColor: '#f6f6f6' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#1a1a1a' }}>Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: '#1a1a1a' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-2"
                      style={{ 
                        focusRingColor: '#f9b222',
                        focusBorderColor: '#f9b222'
                      }}
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#1a1a1a' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-2"
                      style={{ 
                        focusRingColor: '#f9b222',
                        focusBorderColor: '#f9b222'
                      }}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2" style={{ color: '#1a1a1a' }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-2"
                      style={{ 
                        focusRingColor: '#f9b222',
                        focusBorderColor: '#f9b222'
                      }}
                      placeholder="+977-xxx-xxx-xxx"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium mb-2" style={{ color: '#1a1a1a' }}>
                      Service Interest
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-2"
                      style={{ 
                        focusRingColor: '#f9b222',
                        focusBorderColor: '#f9b222'
                      }}
                    >
                      <option value="">Select a service</option>
                      {services.map((service) => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2" style={{ color: '#1a1a1a' }}>
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-2"
                    style={{ 
                      focusRingColor: '#f9b222',
                      focusBorderColor: '#f9b222'
                    }}
                    placeholder="What can we help you with?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: '#1a1a1a' }}>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-2"
                    style={{ 
                      focusRingColor: '#f9b222',
                      focusBorderColor: '#f9b222'
                    }}
                    placeholder="Please provide details about your shipping needs..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
                  style={{ backgroundColor: '#f9b222' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6a01e'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f9b222'}
                >
                  <Send className="h-5 w-5" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>

            {/* Map & Office Info */}
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold mb-4" style={{ color: '#1a1a1a' }}>Our Location</h3>
                <div className="rounded-lg h-64 flex items-center justify-center mb-4" style={{ backgroundColor: '#f6f6f6' }}>
                  <div className="text-center text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p>Interactive Map</p>
                    <p className="text-sm">Thamel, Kathmandu, Nepal</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: '#f9b222' }} />
                    <div>
                      <p className="font-medium" style={{ color: '#1a1a1a' }}>NepalCargo Headquarters</p>
                      <p className="text-gray-600">Thamel, Kathmandu 44600, Nepal</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: '#f9b222' }} />
                    <div>
                      <p className="font-medium" style={{ color: '#1a1a1a' }}>Office Hours</p>
                      <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p className="text-gray-600">Saturday: 9:00 AM - 4:00 PM</p>
                      <p className="text-gray-600">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold mb-4" style={{ color: '#1a1a1a' }}>Quick Contact</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: '#f6f6f6' }}>
                    <Phone className="h-5 w-5" style={{ color: '#f9b222' }} />
                    <div>
                      <p className="font-medium" style={{ color: '#1a1a1a' }}>Emergency Hotline</p>
                      <p className="font-semibold" style={{ color: '#f9b222' }}>+977-1-4444-555</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: '#f6f6f6' }}>
                    <Mail className="h-5 w-5" style={{ color: '#f9b222' }} />
                    <div>
                      <p className="font-medium" style={{ color: '#1a1a1a' }}>Customer Support</p>
                      <p className="font-semibold" style={{ color: '#f9b222' }}>support@nepalcargo.com</p>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4" style={{ backgroundColor: '#f6f6f6', borderColor: '#f9b222' }}>
                    <p className="text-sm" style={{ color: '#1a1a1a' }}>
                      <strong>24/7 Support:</strong> Our customer service team is available 
                      around the clock for urgent shipping matters and tracking assistance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#1a1a1a' }}>Before You Contact Us</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Check if your question is already answered in our frequently asked questions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                question: "How do I track my shipment?",
                answer: "Use your tracking number on our tracking page or call customer service."
              },
              {
                question: "What are your shipping rates?",
                answer: "Rates vary by destination, weight, and service. Use our quote calculator for accurate pricing."
              },
              {
                question: "How long does shipping take?",
                answer: "Delivery times range from 1-3 days (air express) to 15-30 days (sea freight)."
              },
              {
                question: "Do you provide insurance?",
                answer: "Yes, we offer comprehensive cargo insurance at 2% of declared value."
              },
              {
                question: "What documents do I need?",
                answer: "Required documents vary by destination. Our team will guide you through the process."
              },
              {
                question: "Can you handle fragile items?",
                answer: "Yes, we specialize in handling delicate items like handicrafts and artwork."
              }
            ].map((faq, index) => (
              <div key={index} className="rounded-lg p-6" style={{ backgroundColor: '#f6f6f6' }}>
                <h3 className="font-semibold mb-2" style={{ color: '#1a1a1a' }}>{faq.question}</h3>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <a
              href="/faq"
              className="inline-flex items-center space-x-2 font-medium"
              style={{ color: '#f9b222' }}
            >
              <span>View All FAQs</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;