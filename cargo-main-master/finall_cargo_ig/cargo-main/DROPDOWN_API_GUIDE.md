# Dropdown and Validation API Usage Guide

This guide shows how to use the new dropdown endpoints and validation features in the cargo tracking system.

## 🎯 Dropdown Options API

### Get All Dropdown Options
```typescript
import { trackingAPI } from '../services/trackingService';

// Get all dropdown options at once (efficient for app initialization)
const allOptions = await trackingAPI.getDropdownOptions();

console.log(allOptions.status);        // Status options with colors and icons
console.log(allOptions.serviceType);   // Service types with pricing and timing
console.log(allOptions.countries);     // Countries with regions
console.log(allOptions.packageTypes);  // Package types with icons
console.log(allOptions.priorities);    // Priority levels with colors
```

### Get Filtered Options by Category
```typescript
// Get all status options
const statusOptions = await trackingAPI.getFilteredDropdownOptions('status');

// Get service types within price range
const affordableServices = await trackingAPI.getFilteredDropdownOptions('serviceType', {
  priceRange: '10-30'
});

// Get countries by region
const europeanCountries = await trackingAPI.getFilteredDropdownOptions('countries', {
  region: 'Europe'
});

// Search countries by name
const searchResults = await trackingAPI.getFilteredDropdownOptions('countries', {
  filter: 'united'
});
```

## 🤖 Service Recommendations

### Get Smart Service Recommendations
```typescript
// Get service recommendations based on criteria
const recommendations = await trackingAPI.getServiceRecommendations({
  urgency: 'urgent',
  budget: '$40',
  destination: 'CA',
  weight: '5',
  packageType: 'envelope'
});

console.log(recommendations.topRecommendation);      // Best match
console.log(recommendations.alternativeOptions);    // Alternative choices
console.log(recommendations.recommendations);       // All options ranked

// Each recommendation includes:
// - recommendationScore: numerical score
// - reasons: array of why it's recommended
// - confidence: 'high', 'medium', or 'low'
// - rank: position in recommendations
```

## ✅ Address Validation

### Validate Customer Addresses
```typescript
// Validate shipping address
const addressValidation = await trackingAPI.validateAddress({
  street: '123 Main Street',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  country: 'US'
});

if (addressValidation.isValid) {
  console.log('Address is valid:', addressValidation.formattedAddress);
} else {
  console.log('Validation errors:', addressValidation.errors);
  console.log('Suggestions:', addressValidation.suggestions);
}

// Response includes:
// - isValid: boolean
// - errors: array of validation errors
// - suggestions: helpful tips for user
// - formattedAddress: standardized format
// - validationScore: 0-100 score
```

## 🔍 Tracking ID Validation

### Validate Tracking ID Format
```typescript
// Validate tracking ID before lookup
const trackingValidation = await trackingAPI.validateTrackingId('TRK-20241215-A1B2');

if (trackingValidation.isValid) {
  console.log('Valid tracking ID:', trackingValidation.formattedTrackingId);
} else {
  console.log('Invalid format:', trackingValidation.errors);
  console.log('Expected format:', trackingValidation.suggestions);
}
```

## 📊 Dashboard Statistics

### Get Shipment Analytics
```typescript
// Get statistics for different timeframes
const stats30d = await trackingAPI.getStatistics('30d');
const stats7d = await trackingAPI.getStatistics('7d');
const stats90d = await trackingAPI.getStatistics('90d');

console.log('Delivery rate:', stats30d.summary.deliveryRate);
console.log('Total shipments:', stats30d.summary.totalShipments);
console.log('Performance score:', stats30d.metrics.performanceScore);

// Status breakdown for charts
stats30d.breakdowns.status.forEach(status => {
  console.log(`${status._id}: ${status.count} shipments`);
});
```

## 📅 Delivery Date Calculator

### Calculate Expected Delivery
```typescript
// Calculate delivery date based on service type
const deliveryDate = await trackingAPI.calculateDeliveryDate('express', '2024-12-15');
console.log('Expected delivery:', deliveryDate); // Returns ISO date string

// Use with date picker components
const startDate = new Date().toISOString().split('T')[0];
const estimatedDelivery = await trackingAPI.calculateDeliveryDate('overnight', startDate);
```

## 🔄 Bulk Operations

### Update Multiple Shipments
```typescript
// Bulk status update
const bulkResult = await trackingAPI.bulkUpdate(
  'update-status',
  ['TRK-20241215-A1B2', 'TRK-20241215-C3D4'],
  { status: 'delivered' }
);

console.log(`${bulkResult.successful.length} updated successfully`);
console.log(`${bulkResult.failed.length} failed`);
bulkResult.failed.forEach(failure => {
  console.log(`${failure.id}: ${failure.reason}`);
});

// Bulk delete
const deleteResult = await trackingAPI.bulkUpdate(
  'delete',
  ['old-shipment-id-1', 'old-shipment-id-2']
);
```

## 🎨 UI Implementation Examples

### React Dropdown Component
```tsx
import React, { useState, useEffect } from 'react';
import { trackingAPI, DropdownOption } from '../services/trackingService';

function StatusDropdown({ value, onChange }) {
  const [options, setOptions] = useState<DropdownOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const statusOptions = await trackingAPI.getFilteredDropdownOptions('status');
        setOptions(statusOptions);
      } catch (error) {
        console.error('Failed to load status options:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, []);

  if (loading) return <div>Loading options...</div>;

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="dropdown">
      <option value="">Select Status</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.icon} {option.label}
        </option>
      ))}
    </select>
  );
}
```

### Service Recommendation Component
```tsx
function ServiceRecommendations({ criteria, onSelect }) {
  const [recommendations, setRecommendations] = useState(null);

  useEffect(() => {
    const getRecommendations = async () => {
      if (criteria.urgency || criteria.budget) {
        const recs = await trackingAPI.getServiceRecommendations(criteria);
        setRecommendations(recs);
      }
    };

    getRecommendations();
  }, [criteria]);

  if (!recommendations) return null;

  return (
    <div className="recommendations">
      <h3>Recommended Services</h3>
      
      {/* Top recommendation */}
      <div className="top-recommendation">
        <div className="service-card recommended">
          <h4>{recommendations.topRecommendation.label}</h4>
          <p>Confidence: {recommendations.topRecommendation.confidence}</p>
          <ul>
            {recommendations.topRecommendation.reasons.map((reason, idx) => (
              <li key={idx}>{reason}</li>
            ))}
          </ul>
          <button onClick={() => onSelect(recommendations.topRecommendation)}>
            Select This Service
          </button>
        </div>
      </div>

      {/* Alternative options */}
      <div className="alternatives">
        <h4>Other Options</h4>
        {recommendations.alternativeOptions.map(option => (
          <div key={option.value} className="service-card">
            <h5>{option.label}</h5>
            <p>Score: {option.recommendationScore}</p>
            <button onClick={() => onSelect(option)}>Select</button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Address Validation Component
```tsx
function AddressForm({ onValidAddress }) {
  const [address, setAddress] = useState({
    street: '', city: '', state: '', zipCode: '', country: ''
  });
  const [validation, setValidation] = useState(null);

  const validateAddress = async () => {
    try {
      const result = await trackingAPI.validateAddress(address);
      setValidation(result);
      
      if (result.isValid) {
        onValidAddress(result.formattedAddress);
      }
    } catch (error) {
      console.error('Address validation failed:', error);
    }
  };

  return (
    <div className="address-form">
      <input
        type="text"
        placeholder="Street Address"
        value={address.street}
        onChange={(e) => setAddress({...address, street: e.target.value})}
      />
      {/* ... other fields ... */}
      
      <button onClick={validateAddress}>Validate Address</button>
      
      {validation && !validation.isValid && (
        <div className="validation-errors">
          <h4>Address Issues:</h4>
          <ul>
            {validation.errors.map((error, idx) => (
              <li key={idx} className="error">{error}</li>
            ))}
          </ul>
          <h4>Suggestions:</h4>
          <ul>
            {validation.suggestions.map((suggestion, idx) => (
              <li key={idx} className="suggestion">{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
      
      {validation && validation.isValid && (
        <div className="validation-success">
          ✅ Address is valid: {validation.formattedAddress}
        </div>
      )}
    </div>
  );
}
```

## 🚀 Best Practices

### 1. Efficient Data Loading
```typescript
// Load all dropdown options once at app startup
const initializeApp = async () => {
  try {
    const dropdownOptions = await trackingAPI.getDropdownOptions();
    // Store in global state (Redux, Zustand, etc.)
    store.dispatch(setDropdownOptions(dropdownOptions));
  } catch (error) {
    console.error('Failed to initialize dropdown options:', error);
  }
};
```

### 2. Real-time Validation
```typescript
// Debounced validation for better UX
import { debounce } from 'lodash';

const debouncedValidation = debounce(async (trackingId) => {
  if (trackingId.length >= 10) {
    const validation = await trackingAPI.validateTrackingId(trackingId);
    updateValidationState(validation);
  }
}, 500);
```

### 3. Error Handling
```typescript
// Comprehensive error handling
const handleAPICall = async (apiFunction, fallbackData = null) => {
  try {
    return await apiFunction();
  } catch (error) {
    console.error('API call failed:', error);
    
    // Show user-friendly error message
    showNotification('Something went wrong. Please try again.', 'error');
    
    // Return fallback data if available
    return fallbackData;
  }
};
```

### 4. Caching Strategy
```typescript
// Cache dropdown options to reduce API calls
const cachedDropdownOptions = new Map();

const getCachedDropdownOptions = async (category) => {
  if (cachedDropdownOptions.has(category)) {
    return cachedDropdownOptions.get(category);
  }
  
  const options = await trackingAPI.getFilteredDropdownOptions(category);
  cachedDropdownOptions.set(category, options);
  
  return options;
};
```

This comprehensive API provides everything needed for a robust, user-friendly cargo tracking system with smart recommendations, validation, and efficient data management.
