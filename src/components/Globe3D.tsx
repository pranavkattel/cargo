import React, { useRef, useMemo, Suspense, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import ContinentDetailPanel from './ContinentDetailPanel';

interface ContinentHotspotData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
  image: string; // Main image for the continent detail panel
  // Example: Add key locations if you want to expand later
  keyLocations?: { name: string; image: string; description: string }[];
}

const continentsData: ContinentHotspotData[] = [
  {
    id: 'asia',
    name: 'Asia',
    lat: 34.0, // Approximate center
    lng: 100.0,
    description: 'The largest and most populous continent, known for its diverse cultures, ancient civilizations, and stunning landscapes.',
    image: 'https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=600', // Placeholder image
    keyLocations: [
        { name: 'Great Wall', image: 'https://images.pexels.com/photos/869646/pexels-photo-869646.jpeg?auto=compress&cs=tinysrgb&w=300', description: 'Iconic series of fortifications.' },
        { name: 'Taj Mahal', image: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=300', description: 'An ivory-white marble mausoleum.' },
    ]
  },
  {
    id: 'africa',
    name: 'Africa',
    lat: 0.0,
    lng: 20.0,
    description: 'The second-largest continent, home to vast deserts, lush rainforests, and incredible wildlife.',
    image: 'https://images.pexels.com/photos/66898/elephant-cub-tsavo-kenya-66898.jpeg?auto=compress&cs=tinysrgb&w=600', // Placeholder image
  },
  {
    id: 'europe',
    name: 'Europe',
    lat: 54.0,
    lng: 20.0,
    description: 'A continent rich in history, art, and culture, featuring iconic cities and diverse landscapes.',
    image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=600', // Placeholder image
  },
  {
    id: 'north_america',
    name: 'North America',
    lat: 48.0,
    lng: -100.0,
    description: 'A diverse continent with bustling metropolises, vast national parks, and a rich cultural tapestry.',
    image: 'https://images.pexels.com/photos/37337/liberty-statue-new-york-city-sky.jpg?auto=compress&cs=tinysrgb&w=600', // Placeholder image
  },
  {
    id: 'south_america',
    name: 'South America',
    lat: -15.0,
    lng: -60.0,
    description: 'Known for the Amazon rainforest, Andes mountains, vibrant cultures, and ancient ruins.',
    image: 'https://images.pexels.com/photos/2928058/pexels-photo-2928058.jpeg?auto=compress&cs=tinysrgb&w=600', // Placeholder image
  },
  {
    id: 'australia',
    name: 'Australia',
    lat: -25.0,
    lng: 135.0,
    description: 'A continent and country famous for its unique wildlife, stunning beaches, and vast outback.',
    image: 'https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&w=600', // Placeholder image
  },
  // Add Antarctica if needed
];

const Globe = ({ onContinentClick }: { onContinentClick: (continent: ContinentHotspotData) => void }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const globeRadius = 2;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  const getPosition = (lat: number, lng: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    return [x, y, z] as [number, number, number];
  };

  return (
    <>
      <mesh ref={meshRef} geometry={useMemo(() => new THREE.SphereGeometry(globeRadius, 64, 64), [])}>
        <meshStandardMaterial color="#0096C7" wireframe />
      </mesh>

      {continentsData.map((continent) => (
        <Sphere
          key={continent.id}
          args={[0.15, 16, 16]}
          position={getPosition(continent.lat, continent.lng, globeRadius + 0.05)}
          onClick={(e) => {
            e.stopPropagation();
            onContinentClick(continent);
          }}
          onPointerOver={(e) => (e.object.scale.set(1.2, 1.2, 1.2), document.body.style.cursor = 'pointer')}
          onPointerOut={(e) => (e.object.scale.set(1, 1, 1), document.body.style.cursor = 'auto')}
        >
          <meshBasicMaterial color="#F9B222" transparent opacity={0.8} />
        </Sphere>
      ))}

      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />
    </>
  );
};

const Globe3D = () => {
  const [selectedContinent, setSelectedContinent] = useState<ContinentHotspotData | null>(null);

  const handleContinentClick = (continent: ContinentHotspotData) => {
    setSelectedContinent(continent);
  };

  const handleCloseDetailPanel = () => {
    setSelectedContinent(null);
  };

  return (
    <div className="relative w-full h-96 md:h-[500px]"> {/* Added relative positioning */}
      <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }}> {/* Adjusted camera slightly */}
        <Suspense fallback={null}>
          <OrbitControls
            enableZoom={true}
            enablePan={true} // Allow panning
            autoRotate
            autoRotateSpeed={0.2} // Slower auto-rotate
            minDistance={2.5} 
            maxDistance={8} 
          />
          <Globe onContinentClick={handleContinentClick} />

          {/* Text overlay moved inside Canvas and Suspense */}
          {!selectedContinent && (
            <>
              <Text
                color="#FFFFFF"
                anchorX="center"
                anchorY="middle"
                fontSize={0.3}
                position={[0, 0.3, 2.5]}
                font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
              >
                EXPLORE YOUR
              </Text>
              <Text
                color="#F9B222"
                anchorX="center"
                anchorY="middle"
                fontSize={0.5}
                position={[0, -0.1, 2.5]}
                font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
              >
                WORLD
              </Text>
            </>
          )}
          {selectedContinent && (
            <Text
              color="#F9B222"
              anchorX="center"
              anchorY="middle"
              fontSize={0.4}
              position={[0, 0, 2.5]}
              font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
            >
              {selectedContinent.name.toUpperCase()}
            </Text>
          )}
        </Suspense>
      </Canvas>
      {selectedContinent && (
        <ContinentDetailPanel
          continent={selectedContinent}
          onClose={handleCloseDetailPanel}
        />
      )}
    </div>
  );
};

export default Globe3D;