import React from 'react';
import { X } from 'lucide-react';

interface ContinentHotspotData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
  image: string;
  keyLocations?: { name: string; image: string; description: string }[];
}

interface ContinentDetailPanelProps {
  continent: ContinentHotspotData;
  onClose: () => void;
}

const ContinentDetailPanel: React.FC<ContinentDetailPanelProps> = ({ continent, onClose }) => {
  return (
    <div className="absolute top-1/2 right-4 md:right-8 transform -translate-y-1/2 bg-black bg-opacity-70 text-white p-6 rounded-lg shadow-2xl w-full max-w-sm md:max-w-md z-10">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-300 hover:text-white transition-colors"
        aria-label="Close panel"
      >
        <X size={24} />
      </button>

      <h2 className="text-3xl font-bold mb-4">{continent.name.toUpperCase()}</h2>
      
      <div className="mb-4 h-48 w-full overflow-hidden rounded-md">
        <img 
          src={continent.image} 
          alt={continent.name} 
          className="w-full h-full object-cover"
        />
      </div>

      <p className="text-sm text-gray-300 mb-6 leading-relaxed">
        {continent.description}
      </p>

      {continent.keyLocations && continent.keyLocations.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-3">Key Locations</h3>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
            {continent.keyLocations.map(location => (
              <div key={location.name} className="flex items-center space-x-3 p-2 bg-white bg-opacity-10 rounded">
                <img src={location.image} alt={location.name} className="w-16 h-12 object-cover rounded-sm"/>
                <div>
                  <h4 className="font-medium">{location.name}</h4>
                  {/* <p className="text-xs text-gray-400">{location.description}</p> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <button 
        className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-md transition-colors duration-200"
      >
        EXPLORE {continent.name.toUpperCase()}
      </button>
    </div>
  );
};

export default ContinentDetailPanel;
