import React, { useState } from 'react';
import { Calculator, Package, MapPin, DollarSign, Clock, Shield, CheckCircle } from 'lucide-react';

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
  const [quoteResult, setQuoteResult] = useState<any>(null);

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

  const calculateQuote = () => {
    const weight = parseFloat(formData.weight) || 0;
    const volume = (parseFloat(formData.length) || 0) * (parseFloat(formData.width) || 0) * (parseFloat(formData.height) || 0);
    const volumetricWeight = volume / 5000; // Standard volumetric calculation
    const chargeableWeight = Math.max(weight, volumetricWeight);

    let baseRate = 0;
    let deliveryDays = 0;

    switch (formData.shippingMethod) {
      case 'air-express':
        baseRate = 15;
        deliveryDays = 2;
        break;
      case 'air-standard':
        baseRate = 10;
        deliveryDays = 5;
        break;
      case 'sea-freight':
        baseRate = 3;
        deliveryDays = 21;
        break;
      case 'land-transport':
        baseRate = 5;
        deliveryDays = 7;
        break;
      default:
        baseRate = 10;
        deliveryDays = 5;
    }

    // Distance factor
    let distanceFactor = 1;
    if (['USA', 'Canada', 'Australia'].includes(formData.destinationCountry)) {
      distanceFactor = 1.5;
    } else if (['Europe', 'UK', 'Germany'].includes(formData.destinationCountry)) {
      distanceFactor = 1.3;
    }

    const shippingCost = chargeableWeight * baseRate * distanceFactor;
    const handlingFee = 25;
    const insuranceCost = formData.insurance ? parseFloat(formData.goodsValue) * 0.02 : 0;
    const urgencyFee = formData.urgency === 'urgent' ? shippingCost * 0.5 : 0;

    const subtotal = shippingCost + handlingFee + insuranceCost + urgencyFee;
    const tax = subtotal * 0.13; // Nepal VAT
    const total = subtotal + tax;

    setQuoteResult({
      chargeableWeight,
      shippingCost,
      handlingFee,
      insuranceCost,
      urgencyFee,
      tax,
      total,
      deliveryDays: formData.urgency === 'urgent' ? Math.ceil(deliveryDays / 2) : deliveryDays
    });
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateQuote();
      setCurrentStep(5);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
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
                />
                <input
                  type="text"
                  name="pickupCity"
                  placeholder="City"
                  value={formData.pickupCity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <select
                  name="pickupCountry"
                  value={formData.pickupCountry}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                />
                <input
                  type="text"
                  name="destinationCity"
                  placeholder="City"
                  value={formData.destinationCity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <select
                  name="destinationCountry"
                  value={formData.destinationCountry}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    name="length"
                    placeholder="Length (cm)"
                    value={formData.length}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    name="width"
                    placeholder="Width (cm)"
                    value={formData.width}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    name="height"
                    placeholder="Height (cm)"
                    value={formData.height}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        );

      case 5:
        return quoteResult && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">Your Quote is Ready!</h3>
              <p className="text-gray-600">Here's your personalized shipping quote</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Shipment Details</h4>
                  <p className="text-sm text-gray-600">From: {formData.pickupCity}, {formData.pickupCountry}</p>
                  <p className="text-sm text-gray-600">To: {formData.destinationCity}, {formData.destinationCountry}</p>
                  <p className="text-sm text-gray-600">Weight: {formData.weight} kg</p>
                  <p className="text-sm text-gray-600">Chargeable Weight: {quoteResult.chargeableWeight.toFixed(2)} kg</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Service Details</h4>
                  <p className="text-sm text-gray-600">Method: {formData.shippingMethod}</p>
                  <p className="text-sm text-gray-600">Delivery: {quoteResult.deliveryDays} days</p>
                  <p className="text-sm text-gray-600">Insurance: {formData.insurance ? 'Yes' : 'No'}</p>
                  <p className="text-sm text-gray-600">Priority: {formData.urgency}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-gray-900 mb-4">Cost Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping Cost</span>
                    <span className="text-gray-900">${quoteResult.shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Handling Fee</span>
                    <span className="text-gray-900">${quoteResult.handlingFee.toFixed(2)}</span>
                  </div>
                  {quoteResult.insuranceCost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Insurance</span>
                      <span className="text-gray-900">${quoteResult.insuranceCost.toFixed(2)}</span>
                    </div>
                  )}
                  {quoteResult.urgencyFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Urgency Fee</span>
                      <span className="text-gray-900">${quoteResult.urgencyFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (13%)</span>
                    <span className="text-gray-900">${quoteResult.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-blue-600">${quoteResult.total.toFixed(2)}</span>
                  </div>
                </div>
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
      <section className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get Your Quote
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Get an instant quote for your cargo shipment. Simply fill in your requirements 
              and receive a detailed cost breakdown within minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Quote Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step === 5 ? <Calculator className="h-4 w-4" /> : step}
                    </div>
                    {step < 5 && (
                      <div className={`w-full h-1 ml-2 ${
                        currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center text-sm text-gray-600">
                Step {currentStep} of 5: {
                  ['Location Details', 'Package Info', 'Shipping Options', 'Contact Info', 'Your Quote'][currentStep - 1]
                }
              </div>
            </div>

            {/* Form Content */}
            <div className="min-h-[400px]">
              {renderStep()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Previous
              </button>
              
              {currentStep < 5 ? (
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <span>{currentStep === 4 ? 'Calculate Quote' : 'Next'}</span>
                  {currentStep === 4 && <Calculator className="h-4 w-4" />}
                </button>
              ) : (
                <div className="space-x-4">
                  <button
                    onClick={() => window.print()}
                    className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                  >
                    Print Quote
                  </button>
                  <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                    Book Shipment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Quote System?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transparent pricing with no hidden fees
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparent Pricing</h3>
              <p className="text-gray-600">No hidden fees - see exactly what you're paying for</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Quotes</h3>
              <p className="text-gray-600">Get your quote immediately - no waiting required</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Accurate Estimates</h3>
              <p className="text-gray-600">Real-time pricing based on current market rates</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Quote;