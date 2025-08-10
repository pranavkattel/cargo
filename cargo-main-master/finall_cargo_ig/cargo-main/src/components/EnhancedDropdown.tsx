import React, { useState, useEffect } from 'react';
import { DropdownOption } from '../services/trackingService';

interface EnhancedDropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  showDescription?: boolean;
  showIcon?: boolean;
  showPrice?: boolean;
  className?: string;
  error?: string;
}

export const EnhancedDropdown: React.FC<EnhancedDropdownProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option...',
  required = false,
  disabled = false,
  showDescription = true,
  showIcon = true,
  showPrice = false,
  className = '',
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedOption = options?.find(option => option.value === value);

  // Filter options based on search term
  const filteredOptions = (options || []).filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (option.description && option.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle option selection
  const handleSelect = (option: DropdownOption) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm('');
  };

  // Don't render dropdown if options are not loaded yet
  if (!options || options.length === 0) {
    return (
      <div className={`relative ${className}`}>
        <button
          type="button"
          disabled={true}
          className="w-full px-4 py-3 text-left border border-gray-300 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
        >
          Loading options...
        </button>
      </div>
    );
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.enhanced-dropdown')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`enhanced-dropdown relative ${className}`}>
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-3 text-left bg-white border rounded-lg shadow-sm
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-400 cursor-pointer'}
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-200
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {selectedOption ? (
              <>
                {showIcon && selectedOption.icon && (
                  <span className="text-lg">{selectedOption.icon}</span>
                )}
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {selectedOption.label}
                    {showPrice && selectedOption.price && (
                      <span className="ml-2 text-green-600 font-semibold">
                        {selectedOption.price}
                      </span>
                    )}
                  </div>
                  {showDescription && selectedOption.description && (
                    <div className="text-sm text-gray-500">
                      {selectedOption.description}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* Search Input */}
          {options.length > 5 && (
            <div className="p-3 border-b border-gray-200">
              <input
                type="text"
                placeholder="Search options..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {/* Options List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`
                    w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50
                    ${selectedOption?.value === option.value ? 'bg-blue-50 border-r-4 border-blue-500' : ''}
                    border-b border-gray-100 last:border-b-0
                    focus:outline-none transition-colors duration-150
                  `}
                >
                  <div className="flex items-center space-x-3">
                    {showIcon && option.icon && (
                      <span className="text-lg flex-shrink-0">{option.icon}</span>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 truncate">
                          {option.label}
                        </span>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          {showPrice && option.price && (
                            <span className="text-green-600 font-semibold text-sm">
                              {option.price}
                            </span>
                          )}
                          {option.popular && (
                            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                              Popular
                            </span>
                          )}
                          {option.estimatedDays && (
                            <span className="text-gray-500 text-xs">
                              {option.estimatedDays} day{option.estimatedDays > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                      {showDescription && option.description && (
                        <p className="text-sm text-gray-500 mt-1 truncate">
                          {option.description}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500 text-center">
                No options found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface StatusDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  disabled?: boolean;
  className?: string;
  error?: string;
}

export const StatusDropdown: React.FC<StatusDropdownProps> = ({
  value,
  onChange,
  options,
  disabled = false,
  className = '',
  error
}) => {
  return (
    <EnhancedDropdown
      label="Shipment Status"
      value={value}
      onChange={onChange}
      options={options}
      placeholder="Select shipment status..."
      required
      disabled={disabled}
      showDescription={true}
      showIcon={true}
      showPrice={false}
      className={className}
      error={error}
    />
  );
};

interface ServiceTypeDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  disabled?: boolean;
  className?: string;
  error?: string;
}

export const ServiceTypeDropdown: React.FC<ServiceTypeDropdownProps> = ({
  value,
  onChange,
  options,
  disabled = false,
  className = '',
  error
}) => {
  return (
    <EnhancedDropdown
      label="Service Type"
      value={value}
      onChange={onChange}
      options={options}
      placeholder="Select service type..."
      required
      disabled={disabled}
      showDescription={true}
      showIcon={true}
      showPrice={true}
      className={className}
      error={error}
    />
  );
};

export default EnhancedDropdown;
