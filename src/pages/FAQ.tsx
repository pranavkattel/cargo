import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqData: FAQItem[] = [
    {
      question: "What items are prohibited for international shipping?",
      answer: "Prohibited items include weapons, explosives, flammable liquids, illegal drugs, hazardous chemicals, and perishable foods. Each destination country may have additional restrictions. We recommend checking with our team for specific items and destinations.",
      category: "Shipping Rules"
    },
    {
      question: "How long does international shipping take?",
      answer: "Delivery times vary by destination and shipping method: Air Express (1-3 days), Air Standard (3-7 days), Sea Freight (15-30 days), Land Transport (5-14 days). Times may vary due to customs processing and local conditions.",
      category: "Delivery"
    },
    {
      question: "Can I insure my cargo?",
      answer: "Yes, we offer comprehensive cargo insurance at 2% of the declared value. This covers loss, damage, or theft during transit. We highly recommend insurance for valuable items. Our team can help you choose the right coverage.",
      category: "Insurance"
    },
    {
      question: "How are shipping costs calculated?",
      answer: "Costs are based on chargeable weight (greater of actual weight or volumetric weight), destination, shipping method, and additional services. Volumetric weight = Length × Width × Height ÷ 5000. Use our quote calculator for accurate pricing.",
      category: "Pricing"
    },
    {
      question: "Do you provide door-to-door delivery?",
      answer: "Yes, we offer complete door-to-door service including pickup from your location and delivery to the final destination. This includes all documentation, customs clearance, and local delivery arrangements.",
      category: "Services"
    },
    {
      question: "What documents are required for international shipping?",
      answer: "Required documents include commercial invoice, packing list, export declaration, and destination-specific certificates. For handicrafts, you may need origin certificates. Our team assists with all documentation requirements.",
      category: "Documentation"
    },
    {
      question: "How can I track my shipment?",
      answer: "You'll receive a tracking number via email once your shipment is processed. Use this number on our tracking page for real-time updates. You can also call our customer service for status updates.",
      category: "Tracking"
    },
    {
      question: "What packaging is required for fragile items?",
      answer: "Fragile items need proper cushioning with bubble wrap, foam, or paper. Use sturdy boxes with 'FRAGILE' markings. For valuable handicrafts, we recommend professional packaging services to ensure maximum protection.",
      category: "Packaging"
    },
    {
      question: "Are there size and weight limits?",
      answer: "Maximum weight per package varies by shipping method: Air cargo (70kg), Sea freight (no limit), Land transport (varies by route). Oversized items may require special handling. Contact us for specific requirements.",
      category: "Shipping Rules"
    },
    {
      question: "How do I prepare Nepali handicrafts for export?",
      answer: "Handicrafts need proper documentation including origin certificates, material composition details, and cultural heritage clearances if applicable. Use protective packaging and consider insurance. Our team specializes in handicraft exports.",
      category: "Speciality Items"
    },
    {
      question: "What happens if my package is delayed?",
      answer: "We monitor all shipments and proactively notify customers of delays. Common causes include customs processing, weather, or documentation issues. We work to resolve delays quickly and keep you informed throughout the process.",
      category: "Delivery"
    },
    {
      question: "Can I ship medicinal herbs and spices?",
      answer: "Yes, but medicinal herbs require phytosanitary certificates and may need special permits depending on the destination. Spices generally require origin certificates. We handle all regulatory requirements for herb and spice exports.",
      category: "Speciality Items"
    },
    {
      question: "Do you handle customs clearance?",
      answer: "Yes, we provide complete customs brokerage services including documentation preparation, duty calculation, government liaison, and clearance procedures. Our experienced team ensures smooth customs processing.",
      category: "Customs"
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept bank transfers, online payments, credit cards, and cash payments at our office. For regular customers, we offer credit terms. Payment is typically required before shipment processing.",
      category: "Payment"
    },
    {
      question: "How do I file a claim for damaged goods?",
      answer: "Report damage immediately upon delivery. Take photos of the damage and packaging. File a claim within 7 days with our customer service team. If insured, we'll process the claim with the insurance company.",
      category: "Insurance"
    },
    {
      question: "Can I change the delivery address after shipping?",
      answer: "Address changes are possible but depend on the shipment's current location. Changes may incur additional fees. Contact our customer service immediately if you need to modify the delivery address.",
      category: "Delivery"
    }
  ];

  const categories = ['All', ...Array.from(new Set(faqData.map(item => item.category)))];

  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="text-white py-20" style={{ background: 'linear-gradient(to right, #1a1a1a, #2d2d2d)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Find answers to common questions about our cargo services, shipping procedures, 
              and international logistics solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-2"
                style={{ 
                  focusRingColor: '#f9b222',
                  focusBorderColor: '#f9b222'
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    selectedCategory === category
                      ? 'text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === category ? '#f9b222' : '#f6f6f6'
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16" style={{ backgroundColor: '#f6f6f6' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFAQs.length > 0 ? (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1" style={{ color: '#1a1a1a' }}>
                        {faq.question}
                      </h3>
                      <span className="text-sm font-medium" style={{ color: '#f9b222' }}>
                        {faq.category}
                      </span>
                    </div>
                    <div className="ml-4">
                      {openItems.includes(index) ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </button>
                  
                  {openItems.includes(index) && (
                    <div className="px-6 pb-4">
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#1a1a1a' }}>No FAQs Found</h3>
              <p className="text-gray-600">
                No questions match your search criteria. Try adjusting your search terms or category filter.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Quick Help */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#1a1a1a' }}>Still Need Help?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our customer support team is here to help.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl" style={{ backgroundColor: '#f6f6f6' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#f9b222' }}>
                <span className="text-2xl">📞</span>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#1a1a1a' }}>Call Us</h3>
              <p className="text-gray-600 mb-4">Speak directly with our support team</p>
              <p className="font-semibold" style={{ color: '#f9b222' }}>+977-1-4444-555</p>
            </div>
            
            <div className="text-center p-6 rounded-xl" style={{ backgroundColor: '#f6f6f6' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#f9b222' }}>
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#1a1a1a' }}>Live Chat</h3>
              <p className="text-gray-600 mb-4">Chat with us in real-time</p>
              <p className="font-semibold" style={{ color: '#f9b222' }}>Available 24/7</p>
            </div>
            
            <div className="text-center p-6 rounded-xl" style={{ backgroundColor: '#f6f6f6' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#f9b222' }}>
                <span className="text-2xl">✉️</span>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#1a1a1a' }}>Email Us</h3>
              <p className="text-gray-600 mb-4">Send us your questions</p>
              <p className="font-semibold" style={{ color: '#f9b222' }}>info@nepalcargo.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-16" style={{ backgroundColor: '#f6f6f6' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#1a1a1a' }}>Popular Help Topics</h2>
            <p className="text-lg text-gray-600">
              Quick access to our most searched topics
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Shipping Rates', icon: '💰', description: 'How we calculate costs' },
              { title: 'Tracking Guide', icon: '📦', description: 'How to track your cargo' },
              { title: 'Customs Info', icon: '📋', description: 'Documentation requirements' },
              { title: 'Prohibited Items', icon: '🚫', description: 'What cannot be shipped' },
              { title: 'Insurance Claims', icon: '🛡️', description: 'Filing damage claims' },
              { title: 'Delivery Times', icon: '⏰', description: 'Expected delivery schedules' },
              { title: 'Packaging Tips', icon: '📦', description: 'How to pack safely' },
              { title: 'Payment Methods', icon: '💳', description: 'Available payment options' }
            ].map((topic, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
                <div className="text-2xl mb-2">{topic.icon}</div>
                <h3 className="font-semibold mb-1" style={{ color: '#1a1a1a' }}>{topic.title}</h3>
                <p className="text-sm text-gray-600">{topic.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;