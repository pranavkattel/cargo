import React, { useState } from 'react';
import { Package, MapPin, DollarSign, Clock, Shield, CheckCircle } from 'lucide-react';

interface QuoteForm {
  pickupAddress: string;
  pickupCity: string;
  pickupCountry: string;
  destinationAddress: string;
  destinationCity: string;
  destinationCountry: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  goodsType: string;
  goodsValue: string;
  shippingMethod: string;
  insurance: boolean;
  urgency: string;
  name: string;
  email: string;
  phone: string;
}

const Quote = () => {
  const [formData, setFormData] = useState<QuoteForm>({
    pickupAddress: '',
    pickupCity: '',
    pickupCountry: 'Nepal',
    destinationAddress: '',
    destinationCity: '',
    destinationCountry: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    goodsType: '',
    goodsValue: '',
    shippingMethod: '',
    insurance: false,
    urgency: 'standard',
    name: '',
    email: '',
    phone: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [showThankYou, setShowThankYou] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const countries = [
    'USA', 'UK', 'Germany', 'Japan', 'Australia', 'India', 'China', 'UAE', 
    'Canada', 'France', 'South Korea', 'Singapore', 'Netherlands', 'Italy', 'Spain'
  ];

  const goodsTypes = [
    'Handicrafts & Artwork',
    'Textiles & Clothing',
    'Carpets & Rugs',
    'Pashmina & Shawls',
    'Medicinal Herbs',
    'Tea & Spices',
    'Electronics',
    'Documents',
    'Personal Effects',
    'Commercial Goods',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Add a validation function before nextStep and handleBookShipment
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.pickupAddress.trim() &&
          formData.pickupCity.trim() &&
          formData.pickupCountry.trim() &&
          formData.destinationAddress.trim() &&
          formData.destinationCity.trim() &&
          formData.destinationCountry.trim()
        );
      case 2:
        return (
          formData.weight.trim() &&
          formData.length.trim() &&
          formData.width.trim() &&
          formData.height.trim() &&
          formData.goodsType.trim() &&
          formData.goodsValue.trim()
        );
      case 3:
        return (
          formData.shippingMethod.trim() &&
          formData.urgency.trim()
        );
      case 4:
        return (
          formData.name.trim() &&
          formData.email.trim() &&
          formData.phone.trim()
        );
      default:
        return true;
    }
  };

  // Update nextStep to check validation
  const nextStep = () => {
    if (!isStepValid()) {
      alert('Please fill in all required fields before continuing.');
      return;
    }
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBookShipment = async () => {
    if (!isStepValid()) {
      alert('Please fill in all required fields before submitting.');
      return;
    }
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('http://localhost:5000/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: '', // Not collected in current form
          origin: `${formData.pickupAddress}, ${formData.pickupCity}, ${formData.pickupCountry}`,
          destination: `${formData.destinationAddress}, ${formData.destinationCity}, ${formData.destinationCountry}`,
          weight: `${formData.weight} kg`,
          dimensions: `${formData.length}x${formData.width}x${formData.height} cm`,
          cargoType: formData.goodsType,
          serviceType: formData.shippingMethod,
          urgency: formData.urgency,
          message: `Goods Value: $${formData.goodsValue}${formData.insurance ? ' (Insurance Requested)' : ''}`
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setShowThankYou(true);
      } else {
        setSubmitError(result.message || 'Failed to send quote request');
      }
    } catch (error) {
      console.error('Quote submission error:', error);
      setSubmitError('Failed to send quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    if (showThankYou) {
      return (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">Thank you!</h3>
            <p className="text-gray-600">Your quote request has been submitted.</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <h4 className="font-semibold text-gray-900 mb-2">We will contact you soon with your personalized shipping quote.</h4>
            <p className="text-sm text-gray-600">For urgent queries, please call us directly.</p>
          </div>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Pickup & Destination</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-green-600" />
                  Pickup Location
                </h4>
                <input
                  type="text"
                  name="pickupAddress"
                  placeholder="Pickup address"
                  value={formData.pickupAddress}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <input
                  type="text"
                  name="pickupCity"
                  placeholder="City"
                  value={formData.pickupCity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <select
                  name="pickupCountry"
                  value={formData.pickupCountry}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="Nepal">Nepal</option>
                </select>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-red-600" />
                  Destination
                </h4>
                <input
                  type="text"
                  name="destinationAddress"
                  placeholder="Destination address"
                  value={formData.destinationAddress}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <input
                  type="text"
                  name="destinationCity"
                  placeholder="City"
                  value={formData.destinationCity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <select
                  name="destinationCountry"
                  value={formData.destinationCountry}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Package Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <Package className="h-4 w-4 mr-2 text-blue-600" />
                  Weight & Dimensions
                </h4>
                <input
                  type="number"
                  name="weight"
                  placeholder="Weight (kg)"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    name="length"
                    placeholder="Length (cm)"
                    value={formData.length}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <input
                    type="number"
                    name="width"
                    placeholder="Width (cm)"
                    value={formData.width}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <input
                    type="number"
                    name="height"
                    placeholder="Height (cm)"
                    value={formData.height}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Goods Information</h4>
                <select
                  name="goodsType"
                  value={formData.goodsType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select goods type</option>
                  {goodsTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <input
                  type="number"
                  name="goodsValue"
                  placeholder="Declared value (USD)"
                  value={formData.goodsValue}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Shipping Options</h3>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Select Shipping Method</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { value: 'air-express', label: 'Air Express', time: '1-3 days', icon: '✈️' },
                  { value: 'air-standard', label: 'Air Standard', time: '3-5 days', icon: '🛩️' },
                  { value: 'sea-freight', label: 'Sea Freight', time: '15-25 days', icon: '🚢' },
                  { value: 'land-transport', label: 'Land Transport', time: '5-10 days', icon: '🚛' }
                ].map(method => (
                  <label key={method.value} className="relative">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value={method.value}
                      checked={formData.shippingMethod === method.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.shippingMethod === method.value 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{method.icon}</span>
                          <div>
                            <div className="font-medium text-gray-900">{method.label}</div>
                            <div className="text-sm text-gray-500">{method.time}</div>
                          </div>
                        </div>
                        {formData.shippingMethod === method.value && (
                          <CheckCircle className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Additional Options</h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="insurance"
                    checked={formData.insurance}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-900">Add insurance coverage (2% of declared value)</span>
                </label>
                
                <div className="space-y-2">
                  <label className="font-medium text-gray-900">Urgency</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="urgency"
                        value="standard"
                        checked={formData.urgency === 'standard'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="text-gray-900">Standard</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="urgency"
                        value="urgent"
                        checked={formData.urgency === 'urgent'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="text-gray-900">Urgent (+50% fee)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
            
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Review & Submit</h3>
              <p className="text-gray-600">Please review your details and click "Book Shipment" to submit your request.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              {/* You can add a summary of the formData here if desired */}
              <div className="text-center text-gray-700">
                <div><b>Name:</b> {formData.name}</div>
                <div><b>Email:</b> {formData.email}</div>
                <div><b>Phone:</b> {formData.phone}</div>
                <div><b>Pickup:</b> {formData.pickupAddress}, {formData.pickupCity}, {formData.pickupCountry}</div>
                <div><b>Destination:</b> {formData.destinationAddress}, {formData.destinationCity}, {formData.destinationCountry}</div>
                <div><b>Goods:</b> {formData.goodsType} (${formData.goodsValue})</div>
                <div><b>Shipping:</b> {formData.shippingMethod}, {formData.urgency}, Insurance: {formData.insurance ? 'Yes' : 'No'}</div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="text-white py-20" style={{ background: '#0091c3' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Request a Quote</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">Get a fast, personalized shipping quote for your cargo. Fill out the form below and our team will get back to you promptly.</p>
          </div>
        </div>
      </section>

      {/* Quote Form */}
      <section className="py-16" style={{ backgroundColor: '#f6f6f6' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step && !showThankYou
                        ? 'text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`} style={{ backgroundColor: currentStep >= step && !showThankYou ? '#f9b222' : undefined }}>
                      {/* Remove calculator icon, just show step number */}
                      {step}
                    </div>
                    {step < 5 && (
                      <div className={`w-full h-1 ml-2 ${
                        currentStep > step && !showThankYou ? '' : 'bg-gray-200'
                      }`} style={{ backgroundColor: currentStep > step && !showThankYou ? '#f9b222' : undefined }}></div>
                    )}
                  </div>
                ))}
              </div>
              {!showThankYou && (
                <div className="text-center text-sm text-gray-600">
                  Step {currentStep} of 5: {
                    ['Location Details', 'Package Info', 'Shipping Options', 'Contact Info', 'Review'][currentStep - 1]
                  }
                </div>
              )}
            </div>

            {/* Form Content */}
            <div className="min-h-[400px]">
              {renderStep()}
            </div>

            {/* Navigation Buttons */}
            {!showThankYou && (
              <div className="flex flex-col space-y-4 mt-8 pt-6 border-t border-gray-200">
                {/* Error Display */}
                {submitError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                    {submitError}
                  </div>
                )}
                
                <div className="flex justify-between">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 1 || isSubmitting}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Previous
                  </button>
                  
                  {currentStep < 5 ? (
                    <button
                      onClick={nextStep}
                      className="px-6 py-3 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
                      style={{ backgroundColor: '#f9b222' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6a01e'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f9b222'}
                    >
                      <span>Next</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleBookShipment}
                      disabled={isSubmitting}
                      className="px-6 py-3 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
                      style={{ backgroundColor: isSubmitting ? '#ccc' : '#f9b222' }}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <span>Book Shipment</span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#1a1a1a' }}>Why Choose Our Quote System?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transparent pricing with no hidden fees
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#f9b222' }}>
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#1a1a1a' }}>Transparent Pricing</h3>
              <p className="text-gray-600">No hidden fees - see exactly what you're paying for</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#f9b222' }}>
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#1a1a1a' }}>Instant Quotes</h3>
              <p className="text-gray-600">Get your quote immediately - no waiting required</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#f9b222' }}>
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#1a1a1a' }}>Accurate Estimates</h3>
              <p className="text-gray-600">Real-time pricing based on current market rates</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Quote;