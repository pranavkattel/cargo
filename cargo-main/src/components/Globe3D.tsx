import React, { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { trackingAPI, ShipmentData } from '../services/trackingService';
import { Shape, ExtrudeGeometry } from 'three';

// Utility: Convert SVG path (equirectangular) to lat/lng points (simplified for demo)
function svgPathToLatLng(path: string, width: number, height: number): [number, number][] {
  // This is a simplified parser for SVG 'M x y L x y ... Z' paths (no curves)
  const commands = path.match(/[ML][^MLZ]+/g) || [];
  return commands.map(cmd => {
    const [x, y] = cmd.slice(1).trim().split(/\s+/).map(Number);
    // Convert SVG x/y to lat/lng (equirectangular)
    const lng = (x / width) * 360 - 180;
    const lat = 90 - (y / height) * 180;
    return [lat, lng];
  });
}

// Example SVG paths for Africa and South America (simplified, demo only)
const africaPath = 'M 200 300 L 220 320 L 240 340 L 260 360 L 280 340 L 300 320 L 320 300 Z';
const southAmericaPath = 'M 100 400 L 120 420 L 140 440 L 160 460 L 180 440 L 200 420 L 220 400 Z';
const svgWidth = 360; // SVG map width
const svgHeight = 180; // SVG map height

const africaLatLng = svgPathToLatLng(africaPath, svgWidth, svgHeight);
const southAmericaLatLng = svgPathToLatLng(southAmericaPath, svgWidth, svgHeight);

// Project lat/lng to 3D sphere
function latLngToXYZ(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return [x, y, z];
}

// Create Three.js Shape from lat/lng array
function latLngsToShape(latlngs: [number, number][], radius: number) {
  const shape = new Shape();
  latlngs.forEach(([lat, lng], i) => {
    const [x, y, z] = latLngToXYZ(lat, lng, radius);
    if (i === 0) shape.moveTo(x, z); // Use x, z for 2D shape
    else shape.lineTo(x, z);
  });
  return shape;
}

interface CargoLocationData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  shipments: ShipmentData[];
  type: 'origin' | 'destination';
  commonCargoTypes: string[];
  majorExports: string[];
  majorImports: string[];
}

// City coordinates for major shipping locations with cargo type data
const cityCoordinates: Record<string, { 
  lat: number; 
  lng: number; 
  commonCargoTypes: string[];
  majorExports: string[];
  majorImports: string[];
}> = {
  'New York': { 
    lat: 40.7128, lng: -74.0060,
    commonCargoTypes: ['Electronics', 'Fashion', 'Pharmaceuticals', 'Machinery'],
    majorExports: ['Financial Documents', 'Technology', 'Fashion Goods'],
    majorImports: ['Luxury Items', 'Raw Materials', 'Consumer Electronics']
  },
  'London': { 
    lat: 51.5074, lng: -0.1278,
    commonCargoTypes: ['Luxury Goods', 'Pharmaceuticals', 'Financial Documents', 'Art & Antiques'],
    majorExports: ['Financial Services', 'Pharmaceuticals', 'Luxury Goods'],
    majorImports: ['Electronics', 'Textiles', 'Food Products']
  },
  'Los Angeles': { 
    lat: 34.0522, lng: -118.2437,
    commonCargoTypes: ['Entertainment Media', 'Electronics', 'Fashion', 'Automotive Parts'],
    majorExports: ['Entertainment Content', 'Technology', 'Agricultural Products'],
    majorImports: ['Consumer Electronics', 'Clothing', 'Automotive Parts']
  },
  'Sydney': { 
    lat: -33.8688, lng: 151.2093,
    commonCargoTypes: ['Mining Equipment', 'Agricultural Products', 'Wool', 'Wine'],
    majorExports: ['Raw Materials', 'Agricultural Products', 'Mining Equipment'],
    majorImports: ['Machinery', 'Electronics', 'Textiles']
  },
  'Dubai': { 
    lat: 25.2048, lng: 55.2708,
    commonCargoTypes: ['Gold', 'Electronics', 'Textiles', 'Spices'],
    majorExports: ['Precious Metals', 'Re-exports', 'Petrochemicals'],
    majorImports: ['Electronics', 'Machinery', 'Textiles']
  },
  'Singapore': { 
    lat: 1.3521, lng: 103.8198,
    commonCargoTypes: ['Electronics', 'Chemicals', 'Machinery', 'Pharmaceuticals'],
    majorExports: ['Electronics', 'Chemicals', 'Refined Petroleum'],
    majorImports: ['Crude Oil', 'Electronics', 'Machinery']
  },
  'Tokyo': { 
    lat: 35.6762, lng: 139.6503,
    commonCargoTypes: ['Electronics', 'Automotive Parts', 'Machinery', 'Precision Instruments'],
    majorExports: ['Automobiles', 'Electronics', 'Machinery'],
    majorImports: ['Energy', 'Raw Materials', 'Food Products']
  },
  'Shanghai': { 
    lat: 31.2304, lng: 121.4737,
    commonCargoTypes: ['Textiles', 'Electronics', 'Machinery', 'Steel Products'],
    majorExports: ['Electronics', 'Textiles', 'Machinery'],
    majorImports: ['Raw Materials', 'Energy', 'Agricultural Products']
  },
  'Mumbai': { 
    lat: 19.0760, lng: 72.8777,
    commonCargoTypes: ['Textiles', 'Pharmaceuticals', 'Gems & Jewelry', 'Chemicals'],
    majorExports: ['Textiles', 'Pharmaceuticals', 'Gems & Jewelry'],
    majorImports: ['Crude Oil', 'Electronics', 'Machinery']
  },
  'São Paulo': { 
    lat: -23.5505, lng: -46.6333,
    commonCargoTypes: ['Coffee', 'Sugar', 'Automotive Parts', 'Machinery'],
    majorExports: ['Coffee', 'Sugar', 'Soybeans'],
    majorImports: ['Electronics', 'Machinery', 'Chemicals']
  },
  'Buenos Aires': { 
    lat: -34.6118, lng: -58.3960,
    commonCargoTypes: ['Beef', 'Grain', 'Wine', 'Leather Goods'],
    majorExports: ['Agricultural Products', 'Beef', 'Wine'],
    majorImports: ['Machinery', 'Electronics', 'Chemicals']
  },
  'Cape Town': { 
    lat: -33.9249, lng: 18.4241,
    commonCargoTypes: ['Wine', 'Fruit', 'Minerals', 'Textiles'],
    majorExports: ['Wine', 'Fruit', 'Minerals'],
    majorImports: ['Machinery', 'Electronics', 'Textiles']
  },
  'Lagos': { 
    lat: 6.5244, lng: 3.3792,
    commonCargoTypes: ['Oil Products', 'Cocoa', 'Textiles', 'Palm Oil'],
    majorExports: ['Crude Oil', 'Cocoa', 'Palm Oil'],
    majorImports: ['Machinery', 'Electronics', 'Food Products']
  },
  'Cairo': { 
    lat: 30.0444, lng: 31.2357,
    commonCargoTypes: ['Cotton', 'Textiles', 'Petroleum Products', 'Food Products'],
    majorExports: ['Cotton', 'Textiles', 'Petroleum Products'],
    majorImports: ['Machinery', 'Food Products', 'Electronics']
  },
  'Moscow': { 
    lat: 55.7558, lng: 37.6176,
    commonCargoTypes: ['Energy Products', 'Metals', 'Chemicals', 'Machinery'],
    majorExports: ['Energy Products', 'Metals', 'Chemicals'],
    majorImports: ['Machinery', 'Electronics', 'Food Products']
  },
  'Paris': { 
    lat: 48.8566, lng: 2.3522,
    commonCargoTypes: ['Luxury Goods', 'Wine', 'Fashion', 'Pharmaceuticals'],
    majorExports: ['Luxury Goods', 'Wine', 'Fashion'],
    majorImports: ['Electronics', 'Machinery', 'Energy']
  },
  'Berlin': { 
    lat: 52.5200, lng: 13.4050,
    commonCargoTypes: ['Machinery', 'Automotive Parts', 'Chemicals', 'Electronics'],
    majorExports: ['Machinery', 'Automotive Parts', 'Chemicals'],
    majorImports: ['Energy', 'Electronics', 'Food Products']
  },
  'Madrid': { 
    lat: 40.4168, lng: -3.7038,
    commonCargoTypes: ['Wine', 'Olive Oil', 'Textiles', 'Machinery'],
    majorExports: ['Wine', 'Olive Oil', 'Textiles'],
    majorImports: ['Energy', 'Machinery', 'Electronics']
  },
  'Rome': { 
    lat: 41.9028, lng: 12.4964,
    commonCargoTypes: ['Fashion', 'Food Products', 'Machinery', 'Textiles'],
    majorExports: ['Fashion', 'Food Products', 'Machinery'],
    majorImports: ['Energy', 'Electronics', 'Raw Materials']
  },
  'Montreal': { 
    lat: 45.5017, lng: -73.5673,
    commonCargoTypes: ['Aerospace Parts', 'Pharmaceuticals', 'Aluminum', 'Maple Syrup'],
    majorExports: ['Aerospace Parts', 'Aluminum', 'Pharmaceuticals'],
    majorImports: ['Electronics', 'Machinery', 'Energy']
  },
  'Vancouver': { 
    lat: 49.2827, lng: -123.1207,
    commonCargoTypes: ['Lumber', 'Grain', 'Coal', 'Salmon'],
    majorExports: ['Lumber', 'Grain', 'Coal'],
    majorImports: ['Electronics', 'Machinery', 'Consumer Goods']
  },
  'Mexico City': { 
    lat: 19.4326, lng: -99.1332,
    commonCargoTypes: ['Automotive Parts', 'Electronics', 'Textiles', 'Silver'],
    majorExports: ['Automotive Parts', 'Electronics', 'Silver'],
    majorImports: ['Machinery', 'Electronics', 'Chemicals']
  },
  'Lima': { 
    lat: -12.0464, lng: -77.0428,
    commonCargoTypes: ['Copper', 'Fish Products', 'Textiles', 'Gold'],
    majorExports: ['Copper', 'Fish Products', 'Gold'],
    majorImports: ['Machinery', 'Electronics', 'Chemicals']
  },
  'Bogotá': { 
    lat: 4.7110, lng: -74.0721,
    commonCargoTypes: ['Coffee', 'Flowers', 'Emeralds', 'Coal'],
    majorExports: ['Coffee', 'Flowers', 'Coal'],
    majorImports: ['Machinery', 'Electronics', 'Chemicals']
  },
  'Johannesburg': { 
    lat: -26.2041, lng: 28.0473,
    commonCargoTypes: ['Gold', 'Diamonds', 'Coal', 'Iron Ore'],
    majorExports: ['Gold', 'Diamonds', 'Coal'],
    majorImports: ['Machinery', 'Electronics', 'Chemicals']
  },
  'Nairobi': { 
    lat: -1.2921, lng: 36.8219,
    commonCargoTypes: ['Coffee', 'Tea', 'Flowers', 'Textiles'],
    majorExports: ['Coffee', 'Tea', 'Flowers'],
    majorImports: ['Machinery', 'Electronics', 'Chemicals']
  },
  'Bangkok': { 
    lat: 13.7563, lng: 100.5018,
    commonCargoTypes: ['Rice', 'Electronics', 'Textiles', 'Rubber'],
    majorExports: ['Rice', 'Electronics', 'Rubber'],
    majorImports: ['Machinery', 'Crude Oil', 'Electronics']
  },
  'Jakarta': { 
    lat: -6.2088, lng: 106.8456,
    commonCargoTypes: ['Palm Oil', 'Coal', 'Textiles', 'Electronics'],
    majorExports: ['Palm Oil', 'Coal', 'Textiles'],
    majorImports: ['Machinery', 'Electronics', 'Chemicals']
  },
  'Manila': { 
    lat: 14.5995, lng: 120.9842,
    commonCargoTypes: ['Electronics', 'Coconut Products', 'Bananas', 'Textiles'],
    majorExports: ['Electronics', 'Coconut Products', 'Bananas'],
    majorImports: ['Machinery', 'Electronics', 'Chemicals']
  },
  'Seoul': { 
    lat: 37.5665, lng: 126.9780,
    commonCargoTypes: ['Electronics', 'Automotive Parts', 'Steel', 'Chemicals'],
    majorExports: ['Electronics', 'Automotive Parts', 'Steel'],
    majorImports: ['Energy', 'Raw Materials', 'Machinery']
  },
  'Beijing': { 
    lat: 39.9042, lng: 116.4074,
    commonCargoTypes: ['Electronics', 'Machinery', 'Textiles', 'Steel'],
    majorExports: ['Electronics', 'Machinery', 'Textiles'],
    majorImports: ['Energy', 'Raw Materials', 'Agricultural Products']
  },
  'Hong Kong': { 
    lat: 22.3193, lng: 114.1694,
    commonCargoTypes: ['Electronics', 'Textiles', 'Toys', 'Watches'],
    majorExports: ['Electronics', 'Textiles', 'Re-exports'],
    majorImports: ['Raw Materials', 'Electronics', 'Food Products']
  },
  'Karachi': { 
    lat: 24.8607, lng: 67.0011,
    commonCargoTypes: ['Textiles', 'Rice', 'Cotton', 'Leather'],
    majorExports: ['Textiles', 'Rice', 'Cotton'],
    majorImports: ['Machinery', 'Electronics', 'Chemicals']
  },
  'Delhi': { 
    lat: 28.7041, lng: 77.1025,
    commonCargoTypes: ['Textiles', 'Handicrafts', 'Pharmaceuticals', 'Spices'],
    majorExports: ['Textiles', 'Pharmaceuticals', 'Spices'],
    majorImports: ['Electronics', 'Machinery', 'Energy']
  },
  'Tehran': { 
    lat: 35.6892, lng: 51.3890,
    commonCargoTypes: ['Petroleum Products', 'Carpets', 'Pistachios', 'Petrochemicals'],
    majorExports: ['Petroleum Products', 'Carpets', 'Pistachios'],
    majorImports: ['Machinery', 'Electronics', 'Food Products']
  },
  'Istanbul': { 
    lat: 41.0082, lng: 28.9784,
    commonCargoTypes: ['Textiles', 'Steel', 'Automotive Parts', 'Hazelnuts'],
    majorExports: ['Textiles', 'Steel', 'Automotive Parts'],
    majorImports: ['Energy', 'Machinery', 'Electronics']
  },
  'Riyadh': { 
    lat: 24.7136, lng: 46.6753,
    commonCargoTypes: ['Petroleum Products', 'Petrochemicals', 'Dates', 'Plastics'],
    majorExports: ['Petroleum Products', 'Petrochemicals', 'Plastics'],
    majorImports: ['Machinery', 'Electronics', 'Food Products']
  },
  'Kuwait City': { 
    lat: 29.3117, lng: 47.4818,
    commonCargoTypes: ['Petroleum Products', 'Petrochemicals', 'Fertilizers'],
    majorExports: ['Petroleum Products', 'Petrochemicals', 'Fertilizers'],
    majorImports: ['Machinery', 'Electronics', 'Food Products']
  },
  'Doha': { 
    lat: 25.2854, lng: 51.5310,
    commonCargoTypes: ['Natural Gas', 'Petroleum Products', 'Aluminum', 'Fertilizers'],
    majorExports: ['Natural Gas', 'Petroleum Products', 'Aluminum'],
    majorImports: ['Machinery', 'Electronics', 'Food Products']
  },
  'Abu Dhabi': { 
    lat: 24.2539, lng: 54.3773,
    commonCargoTypes: ['Petroleum Products', 'Aluminum', 'Chemicals', 'Dates'],
    majorExports: ['Petroleum Products', 'Aluminum', 'Chemicals'],
    majorImports: ['Machinery', 'Electronics', 'Food Products']
  },
  'Barcelona': { 
    lat: 41.3851, lng: 2.1734,
    commonCargoTypes: ['Textiles', 'Wine', 'Automotive Parts', 'Machinery'],
    majorExports: ['Textiles', 'Wine', 'Chemicals'],
    majorImports: ['Electronics', 'Energy', 'Raw Materials']
  },
  'Amsterdam': { 
    lat: 52.3676, lng: 4.9041,
    commonCargoTypes: ['Flowers', 'Cheese', 'Electronics', 'Chemicals'],
    majorExports: ['Flowers', 'Agricultural Products', 'Chemicals'],
    majorImports: ['Electronics', 'Machinery', 'Energy']
  },
  'Miami': { 
    lat: 25.7617, lng: -80.1918,
    commonCargoTypes: ['Pharmaceuticals', 'Electronics', 'Textiles', 'Luxury Goods'],
    majorExports: ['Pharmaceuticals', 'Electronics', 'Aerospace Parts'],
    majorImports: ['Coffee', 'Textiles', 'Consumer Goods']
  },
  'San Francisco': { 
    lat: 37.7749, lng: -122.4194,
    commonCargoTypes: ['Technology', 'Electronics', 'Wine', 'Machinery'],
    majorExports: ['Technology', 'Electronics', 'Software'],
    majorImports: ['Electronics', 'Textiles', 'Food Products']
  },
  'Chicago': { 
    lat: 41.8781, lng: -87.6298,
    commonCargoTypes: ['Grain', 'Machinery', 'Steel', 'Automotive Parts'],
    majorExports: ['Agricultural Products', 'Machinery', 'Steel'],
    majorImports: ['Electronics', 'Textiles', 'Raw Materials']
  },
  'Toronto': { 
    lat: 43.6532, lng: -79.3832,
    commonCargoTypes: ['Maple Syrup', 'Machinery', 'Pharmaceuticals', 'Lumber'],
    majorExports: ['Natural Resources', 'Machinery', 'Pharmaceuticals'],
    majorImports: ['Electronics', 'Energy', 'Textiles']
  },
  'Zurich': { 
    lat: 47.3769, lng: 8.5417,
    commonCargoTypes: ['Watches', 'Pharmaceuticals', 'Precision Instruments', 'Chocolate'],
    majorExports: ['Watches', 'Pharmaceuticals', 'Machinery'],
    majorImports: ['Electronics', 'Energy', 'Raw Materials']
  },
  'Vienna': { 
    lat: 48.2082, lng: 16.3738,
    commonCargoTypes: ['Machinery', 'Steel', 'Chemicals', 'Wood Products'],
    majorExports: ['Machinery', 'Steel', 'Chemicals'],
    majorImports: ['Energy', 'Electronics', 'Textiles']
  },
  'Stockholm': { 
    lat: 59.3293, lng: 18.0686,
    commonCargoTypes: ['Lumber', 'Steel', 'Machinery', 'Paper Products'],
    majorExports: ['Lumber', 'Steel', 'Machinery'],
    majorImports: ['Electronics', 'Energy', 'Food Products']
  },
  'Helsinki': { 
    lat: 60.1699, lng: 24.9384,
    commonCargoTypes: ['Lumber', 'Paper', 'Electronics', 'Machinery'],
    majorExports: ['Lumber', 'Paper Products', 'Electronics'],
    majorImports: ['Energy', 'Machinery', 'Food Products']
  },
  'Oslo': { 
    lat: 59.9139, lng: 10.7522,
    commonCargoTypes: ['Oil Products', 'Fish', 'Aluminum', 'Machinery'],
    majorExports: ['Oil Products', 'Fish', 'Aluminum'],
    majorImports: ['Machinery', 'Electronics', 'Food Products']
  },
  'Copenhagen': { 
    lat: 55.6761, lng: 12.5683,
    commonCargoTypes: ['Pharmaceuticals', 'Machinery', 'Food Products', 'Wind Turbines'],
    majorExports: ['Pharmaceuticals', 'Machinery', 'Food Products'],
    majorImports: ['Electronics', 'Energy', 'Raw Materials']
  },
  'Lisbon': { 
    lat: 38.7223, lng: -9.1393,
    commonCargoTypes: ['Wine', 'Cork', 'Textiles', 'Fish Products'],
    majorExports: ['Wine', 'Cork', 'Textiles'],
    majorImports: ['Electronics', 'Machinery', 'Energy']
  },
  'Athens': { 
    lat: 37.9838, lng: 23.7275,
    commonCargoTypes: ['Olive Oil', 'Wine', 'Marble', 'Shipping Services'],
    majorExports: ['Olive Oil', 'Wine', 'Marble'],
    majorImports: ['Electronics', 'Machinery', 'Energy']
  },
  'Budapest': { 
    lat: 47.4979, lng: 19.0402,
    commonCargoTypes: ['Machinery', 'Pharmaceuticals', 'Automotive Parts', 'Electronics'],
    majorExports: ['Machinery', 'Automotive Parts', 'Electronics'],
    majorImports: ['Energy', 'Raw Materials', 'Textiles']
  },
  'Prague': { 
    lat: 50.0755, lng: 14.4378,
    commonCargoTypes: ['Glass', 'Beer', 'Machinery', 'Automotive Parts'],
    majorExports: ['Glass Products', 'Machinery', 'Automotive Parts'],
    majorImports: ['Electronics', 'Energy', 'Raw Materials']
  },
  'Warsaw': { 
    lat: 52.2297, lng: 21.0122,
    commonCargoTypes: ['Machinery', 'Automotive Parts', 'Food Products', 'Textiles'],
    majorExports: ['Machinery', 'Food Products', 'Textiles'],
    majorImports: ['Electronics', 'Energy', 'Raw Materials']
  },
  'Casablanca': { 
    lat: 33.5731, lng: -7.5898,
    commonCargoTypes: ['Phosphates', 'Textiles', 'Food Products', 'Leather'],
    majorExports: ['Phosphates', 'Textiles', 'Food Products'],
    majorImports: ['Electronics', 'Machinery', 'Energy']
  },
  'Tunis': { 
    lat: 36.8065, lng: 10.1815,
    commonCargoTypes: ['Olive Oil', 'Textiles', 'Phosphates', 'Machinery'],
    majorExports: ['Olive Oil', 'Textiles', 'Phosphates'],
    majorImports: ['Electronics', 'Machinery', 'Energy']
  },
  'Accra': { 
    lat: 5.6037, lng: -0.1870,
    commonCargoTypes: ['Cocoa', 'Gold', 'Timber', 'Fish Products'],
    majorExports: ['Cocoa', 'Gold', 'Timber'],
    majorImports: ['Electronics', 'Machinery', 'Food Products']
  },
  'Dakar': { 
    lat: 14.7167, lng: -17.4677,
    commonCargoTypes: ['Fish Products', 'Phosphates', 'Groundnuts', 'Textiles'],
    majorExports: ['Fish Products', 'Phosphates', 'Groundnuts'],
    majorImports: ['Electronics', 'Machinery', 'Food Products']
  },
  'Addis Ababa': { 
    lat: 9.1450, lng: 38.7451,
    commonCargoTypes: ['Coffee', 'Leather', 'Textiles', 'Gold'],
    majorExports: ['Coffee', 'Leather', 'Gold'],
    majorImports: ['Electronics', 'Machinery', 'Textiles']
  },
  'Khartoum': { 
    lat: 15.5007, lng: 32.5599,
    commonCargoTypes: ['Cotton', 'Gum Arabic', 'Oil Products', 'Livestock'],
    majorExports: ['Cotton', 'Gum Arabic', 'Oil Products'],
    majorImports: ['Electronics', 'Machinery', 'Food Products']
  },
  'Ho Chi Minh City': { 
    lat: 10.8231, lng: 106.6297,
    commonCargoTypes: ['Rice', 'Coffee', 'Textiles', 'Electronics'],
    majorExports: ['Rice', 'Coffee', 'Textiles'],
    majorImports: ['Electronics', 'Machinery', 'Raw Materials']
  },
  'Hanoi': { 
    lat: 21.0285, lng: 105.8542,
    commonCargoTypes: ['Rice', 'Textiles', 'Electronics', 'Coffee'],
    majorExports: ['Rice', 'Textiles', 'Electronics'],
    majorImports: ['Machinery', 'Raw Materials', 'Energy']
  },
  'Kuala Lumpur': { 
    lat: 3.1390, lng: 101.6869,
    commonCargoTypes: ['Palm Oil', 'Rubber', 'Electronics', 'Tin'],
    majorExports: ['Palm Oil', 'Rubber', 'Electronics'],
    majorImports: ['Machinery', 'Electronics', 'Food Products']
  },
  'Colombo': { 
    lat: 6.9271, lng: 79.8612,
    commonCargoTypes: ['Tea', 'Rubber', 'Coconut Products', 'Textiles'],
    majorExports: ['Tea', 'Rubber', 'Coconut Products'],
    majorImports: ['Electronics', 'Machinery', 'Energy']
  },
  'Dhaka': { 
    lat: 23.8103, lng: 90.4125,
    commonCargoTypes: ['Textiles', 'Jute', 'Rice', 'Fish Products'],
    majorExports: ['Textiles', 'Jute', 'Fish Products'],
    majorImports: ['Electronics', 'Machinery', 'Energy']
  },
  'Yangon': { 
    lat: 16.8661, lng: 96.1951,
    commonCargoTypes: ['Rice', 'Timber', 'Gems', 'Natural Gas'],
    majorExports: ['Rice', 'Timber', 'Natural Gas'],
    majorImports: ['Electronics', 'Machinery', 'Food Products']
  },
  'Phnom Penh': { 
    lat: 11.5564, lng: 104.9282,
    commonCargoTypes: ['Rice', 'Rubber', 'Fish Products', 'Textiles'],
    majorExports: ['Rice', 'Rubber', 'Fish Products'],
    majorImports: ['Electronics', 'Machinery', 'Energy']
  },
  'Vientiane': { 
    lat: 17.9757, lng: 102.6331,
    commonCargoTypes: ['Coffee', 'Timber', 'Hydroelectric Power', 'Textiles'],
    majorExports: ['Coffee', 'Timber', 'Hydroelectric Power'],
    majorImports: ['Electronics', 'Machinery', 'Food Products']
  },
  'Ulaanbaatar': { 
    lat: 47.8864, lng: 106.9057,
    commonCargoTypes: ['Copper', 'Cashmere', 'Livestock', 'Coal'],
    majorExports: ['Copper', 'Cashmere', 'Coal'],
    majorImports: ['Electronics', 'Machinery', 'Food Products']
  },
  'Almaty': { 
    lat: 43.2220, lng: 76.8512,
    commonCargoTypes: ['Oil Products', 'Grain', 'Metals', 'Wool'],
    majorExports: ['Oil Products', 'Grain', 'Metals'],
    majorImports: ['Electronics', 'Machinery', 'Food Products']
  },
  'Tashkent': { 
    lat: 41.2995, lng: 69.2401,
    commonCargoTypes: ['Cotton', 'Natural Gas', 'Gold', 'Textiles'],
    majorExports: ['Cotton', 'Natural Gas', 'Gold'],
    majorImports: ['Electronics', 'Machinery', 'Food Products']
  },
  'Baku': { 
    lat: 40.4093, lng: 49.8671,
    commonCargoTypes: ['Oil Products', 'Natural Gas', 'Cotton', 'Caviar'],
    majorExports: ['Oil Products', 'Natural Gas', 'Cotton'],
    majorImports: ['Electronics', 'Machinery', 'Food Products']
  },
  'Yerevan': { 
    lat: 40.0776, lng: 44.3076,
    commonCargoTypes: ['Copper', 'Wine', 'Diamonds', 'Textiles'],
    majorExports: ['Copper', 'Wine', 'Precious Stones'],
    majorImports: ['Electronics', 'Machinery', 'Energy']
  },
  'Tbilisi': { 
    lat: 41.7151, lng: 44.8271,
    commonCargoTypes: ['Wine', 'Copper', 'Citrus Fruits', 'Textiles'],
    majorExports: ['Wine', 'Copper', 'Citrus Fruits'],
    majorImports: ['Electronics', 'Machinery', 'Energy']
  },
  'Auckland': { 
    lat: -36.8485, lng: 174.7633,
    commonCargoTypes: ['Dairy Products', 'Wine', 'Wool', 'Lumber'],
    majorExports: ['Dairy Products', 'Wine', 'Wool'],
    majorImports: ['Electronics', 'Machinery', 'Energy']
  },
  'Wellington': { 
    lat: -41.2865, lng: 174.7762,
    commonCargoTypes: ['Dairy Products', 'Wine', 'Lumber', 'Fish Products'],
    majorExports: ['Dairy Products', 'Wine', 'Fish Products'],
    majorImports: ['Electronics', 'Machinery', 'Energy']
  },
  'Perth': { 
    lat: -31.9505, lng: 115.8605,
    commonCargoTypes: ['Iron Ore', 'Gold', 'Natural Gas', 'Wheat'],
    majorExports: ['Iron Ore', 'Gold', 'Natural Gas'],
    majorImports: ['Electronics', 'Machinery', 'Food Products']
  },
  'Melbourne': { 
    lat: -37.8136, lng: 144.9631,
    commonCargoTypes: ['Wool', 'Dairy Products', 'Wine', 'Machinery'],
    majorExports: ['Wool', 'Dairy Products', 'Wine'],
    majorImports: ['Electronics', 'Machinery', 'Energy']
  },
  'Brisbane': { 
    lat: -27.4698, lng: 153.0251,
    commonCargoTypes: ['Coal', 'Beef', 'Sugar', 'Bauxite'],
    majorExports: ['Coal', 'Beef', 'Sugar'],
    majorImports: ['Electronics', 'Machinery', 'Energy']
  },
  'Adelaide': { 
    lat: -34.9285, lng: 138.6007,
    commonCargoTypes: ['Wine', 'Wheat', 'Barley', 'Machinery'],
    majorExports: ['Wine', 'Wheat', 'Barley'],
    majorImports: ['Electronics', 'Machinery', 'Energy']
  },
  'Santiago': { 
    lat: -33.4489, lng: -70.6693,
    commonCargoTypes: ['Copper', 'Wine', 'Fish Products', 'Fruit'],
    majorExports: ['Copper', 'Wine', 'Fish Products'],
    majorImports: ['Electronics', 'Machinery', 'Energy']
  },
  'Valparaiso': { 
    lat: -33.0472, lng: -71.6127,
    commonCargoTypes: ['Copper', 'Fish Products', 'Wine', 'Fruit'],
    majorExports: ['Copper', 'Fish Products', 'Wine'],
    majorImports: ['Electronics', 'Machinery', 'Energy']
  },
  'Quito': { 
    lat: -0.1807, lng: -78.4678,
    commonCargoTypes: ['Oil Products', 'Bananas', 'Coffee', 'Cocoa'],
    majorExports: ['Oil Products', 'Bananas', 'Coffee'],
    majorImports: ['Electronics', 'Machinery', 'Food Products']
  },
  'Caracas': { 
    lat: 10.4806, lng: -66.9036,
    commonCargoTypes: ['Oil Products', 'Iron Ore', 'Steel', 'Aluminum'],
    majorExports: ['Oil Products', 'Iron Ore', 'Steel'],
    majorImports: ['Electronics', 'Machinery', 'Food Products']
  },
  'Georgetown': { 
    lat: 6.8013, lng: -58.1551,
    commonCargoTypes: ['Sugar', 'Rice', 'Bauxite', 'Gold'],
    majorExports: ['Sugar', 'Rice', 'Bauxite'],
    majorImports: ['Electronics', 'Machinery', 'Food Products']
  },
  'Brussels': { 
    lat: 50.8503, lng: 4.3517,
    commonCargoTypes: ['Pharmaceuticals', 'Chemicals', 'Machinery', 'Diamonds'],
    majorExports: ['Pharmaceuticals', 'Chemicals', 'Diamonds'],
    majorImports: ['Electronics', 'Energy', 'Raw Materials']
  },
  'Reykjavik': { 
    lat: 64.1466, lng: -21.9426,
    commonCargoTypes: ['Fish Products', 'Aluminum', 'Geothermal Energy', 'Wool'],
    majorExports: ['Fish Products', 'Aluminum', 'Geothermal Energy'],
    majorImports: ['Electronics', 'Machinery', 'Food Products']
  },
  'Montevideo': { 
    lat: -34.9011, lng: -56.1645,
    commonCargoTypes: ['Beef', 'Wool', 'Rice', 'Soybeans'],
    majorExports: ['Beef', 'Wool', 'Agricultural Products'],
    majorImports: ['Electronics', 'Machinery', 'Energy']
  },
  'Asunción': { 
    lat: -25.2637, lng: -57.5759,
    commonCargoTypes: ['Soybeans', 'Beef', 'Cotton', 'Hydroelectric Power'],
    majorExports: ['Soybeans', 'Beef', 'Hydroelectric Power'],
    majorImports: ['Electronics', 'Machinery', 'Food Products']
  },
  'La Paz': { 
    lat: -16.5000, lng: -68.1500,
    commonCargoTypes: ['Natural Gas', 'Tin', 'Silver', 'Quinoa'],
    majorExports: ['Natural Gas', 'Minerals', 'Quinoa'],
    majorImports: ['Electronics', 'Machinery', 'Food Products']
  },
  'Brasília': { 
    lat: -15.8267, lng: -47.9218,
    commonCargoTypes: ['Soybeans', 'Coffee', 'Iron Ore', 'Sugar'],
    majorExports: ['Agricultural Products', 'Iron Ore', 'Coffee'],
    majorImports: ['Electronics', 'Machinery', 'Energy']
  },
  'Kinshasa': { 
    lat: -4.4419, lng: 15.2663,
    commonCargoTypes: ['Copper', 'Cobalt', 'Diamonds', 'Coffee'],
    majorExports: ['Minerals', 'Coffee', 'Timber'],
    majorImports: ['Electronics', 'Machinery', 'Food Products']
  },
  'Libreville': { 
    lat: 0.4162, lng: 9.4673,
    commonCargoTypes: ['Oil Products', 'Timber', 'Manganese', 'Cocoa'],
    majorExports: ['Oil Products', 'Timber', 'Manganese'],
    majorImports: ['Electronics', 'Machinery', 'Food Products']
  },
  'Antananarivo': { 
    lat: -18.8792, lng: 47.5079,
    commonCargoTypes: ['Vanilla', 'Coffee', 'Cloves', 'Textiles'],
    majorExports: ['Vanilla', 'Coffee', 'Textiles'],
    majorImports: ['Electronics', 'Machinery', 'Food Products']
  },
};

const Globe = ({ onLocationClick }: { onLocationClick: (location: CargoLocationData) => void }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [cargoLocations, setCargoLocations] = useState<CargoLocationData[]>([]);

  const globeRadius = 2; // Back to reasonable size

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await trackingAPI.getAllShipments(1, 100);
        const shipments = response.data || [];
        
        // Create locations from selected cities with realistic cargo information
        const locationMap = new Map<string, CargoLocationData>();
        
        // Select only 10 major cities for display
        const selectedCities = [
          'New York', 'London', 'Tokyo', 'Singapore', 'Dubai', 
          'Sydney', 'São Paulo', 'Mumbai', 'Paris', 'Shanghai'
        ];
        
        // Add selected cities as potential shipping locations
        selectedCities.forEach((cityName, index) => {
          const cityData = cityCoordinates[cityName];
          if (cityData) {
            // Randomly assign some cities as origins and others as destinations
            const isOrigin = index % 2 === 0; // Alternate between origin and destination
            const type = isOrigin ? 'origin' : 'destination';
            
            const key = `${cityName}_${type}`;
            locationMap.set(key, {
              id: key,
              name: cityName,
              lat: cityData.lat,
              lng: cityData.lng,
              shipments: [], // We'll show cargo types instead of actual shipments
              type: type,
              commonCargoTypes: cityData.commonCargoTypes,
              majorExports: cityData.majorExports,
              majorImports: cityData.majorImports
            });
          }
        });
        
        // Optionally add real shipment data to matching cities
        shipments.forEach(shipment => {
          const origin = shipment.shipmentDetails.origin;
          const destination = shipment.shipmentDetails.destination;
          
          const originCity = extractCityName(origin);
          const destCity = extractCityName(destination);
          
          if (originCity && selectedCities.includes(originCity)) {
            const key = `${originCity}_origin`;
            if (locationMap.has(key)) {
              locationMap.get(key)!.shipments.push(shipment);
            }
          }
          
          if (destCity && selectedCities.includes(destCity)) {
            const key = `${destCity}_destination`;
            if (locationMap.has(key)) {
              locationMap.get(key)!.shipments.push(shipment);
            }
          }
        });
        
        setCargoLocations(Array.from(locationMap.values()));
      } catch (error) {
        console.error('Error fetching shipments for globe:', error);
        
        // Fallback: show selected cities even if API fails
        const selectedCities = [
          'New York', 'London', 'Tokyo', 'Singapore', 'Dubai', 
          'Sydney', 'São Paulo', 'Mumbai', 'Paris', 'Shanghai'
        ];
        
        const fallbackLocations = selectedCities.map((cityName, index) => {
          const cityData = cityCoordinates[cityName];
          const isOrigin = index % 2 === 0;
          const type = isOrigin ? 'origin' : 'destination';
          
          return {
            id: `${cityName}_${type}`,
            name: cityName,
            lat: cityData.lat,
            lng: cityData.lng,
            shipments: [],
            type: type,
            commonCargoTypes: cityData.commonCargoTypes,
            majorExports: cityData.majorExports,
            majorImports: cityData.majorImports
          } as CargoLocationData;
        });
        
        setCargoLocations(fallbackLocations);
      }
    };
    
    fetchShipments();
  }, []);

  const extractCityName = (location: string): string | null => {
    // Extract city name from location string (e.g., "New York, USA" -> "New York")
    const parts = location.split(',');
    const cityName = parts[0].trim();
    
    // Check if we have coordinates for this city
    return cityCoordinates[cityName] ? cityName : null;
  };

  const getPosition = (lat: number, lng: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    return [x, y, z] as [number, number, number];
  };

  // More detailed (but still performant) continent outlines (lat/lng arrays)
  const continentsLatLng = [
    // Africa
    [
      [37, -17], [35, -7], [32, 0], [30, 7], [27, 13], [23, 17], [18, 20], [12, 23], [7, 25], [2, 27], [-2, 29], [-7, 31], [-12, 33], [-17, 35], [-22, 37], [-27, 39], [-32, 40], [-35, 35], [-33, 28], [-30, 20], [-25, 13], [-20, 7], [-15, 0], [-10, -7], [-5, -13], [0, -17], [5, -17], [10, -17], [15, -17], [20, -17], [25, -17], [30, -17], [35, -17], [37, -17]
    ],
    // Europe
    [
      [70, -10], [68, 0], [65, 10], [62, 20], [60, 30], [58, 40], [55, 50], [52, 60], [50, 70], [48, 80], [46, 90], [44, 100], [42, 110], [40, 120], [38, 130], [36, 140], [34, 150], [32, 160], [30, 170], [28, 180], [26, 170], [24, 160], [22, 150], [20, 140], [18, 130], [16, 120], [14, 110], [12, 100], [10, 90], [8, 80], [6, 70], [4, 60], [2, 50], [0, 40], [-2, 30], [-4, 20], [-6, 10], [-8, 0], [-10, -10], [0, -10], [10, -10], [20, -10], [30, -10], [40, -10], [50, -10], [60, -10], [70, -10]
    ],
    // Asia
    [
      [80, 60], [78, 80], [75, 100], [70, 120], [65, 140], [60, 160], [55, 180], [50, 160], [45, 140], [40, 120], [35, 100], [30, 80], [25, 60], [20, 40], [15, 20], [10, 0], [5, -20], [0, -40], [-5, -60], [-10, -80], [-15, -100], [-20, -120], [-25, -140], [-30, -160], [-35, 180], [-40, 160], [-45, 140], [-50, 120], [-55, 100], [-60, 80], [-65, 60], [-70, 40], [-75, 20], [-80, 0], [-80, 60]
    ],
    // North America
    [
      [70, -150], [68, -130], [65, -110], [62, -90], [60, -70], [58, -50], [55, -30], [52, -10], [50, 10], [48, 30], [46, 50], [44, 70], [42, 90], [40, 110], [38, 130], [36, 150], [34, 170], [32, -170], [30, -150], [28, -130], [26, -110], [24, -90], [22, -70], [20, -50], [18, -30], [16, -10], [14, 10], [12, 30], [10, 50], [8, 70], [6, 90], [4, 110], [2, 130], [0, 150], [-2, -170], [-4, -150], [-6, -130], [-8, -110], [-10, -90], [-12, -70], [-14, -50], [-16, -30], [-18, -10], [-20, 10], [-22, 30], [-24, 50], [-26, 70], [-28, 90], [-30, 110], [-32, 130], [-34, 150], [-36, 170], [-38, -170], [-40, -150], [70, -150]
    ],
    // South America
    [
      [10, -80], [8, -70], [6, -60], [4, -50], [2, -40], [0, -30], [-2, -20], [-4, -10], [-6, 0], [-8, 10], [-10, 20], [-12, 30], [-14, 40], [-16, 50], [-18, 60], [-20, 70], [-22, 80], [-24, 90], [-26, 100], [-28, 110], [-30, 120], [-32, 130], [-34, 140], [-36, 150], [-38, 160], [-40, 170], [-42, -170], [-44, -160], [-46, -150], [-48, -140], [-50, -130], [-52, -120], [-54, -110], [-56, -100], [-58, -90], [-60, -80], [10, -80]
    ],
    // Australia
    [
      [-10, 110], [-12, 120], [-14, 130], [-16, 140], [-18, 150], [-20, 160], [-22, 170], [-24, -180], [-26, -170], [-28, -160], [-30, -150], [-32, -140], [-34, -130], [-36, -120], [-38, -110], [-40, -100], [-10, 110]
    ]
  ];

  return (
    <>
      {/* Main globe */}
      <mesh ref={meshRef} geometry={useMemo(() => new THREE.SphereGeometry(globeRadius, 64, 64), [])}>
        <meshStandardMaterial color="#0091c3" />
      </mesh>

      {/* Glow effect */}
      <mesh geometry={useMemo(() => new THREE.SphereGeometry(globeRadius * 1.04, 64, 64), [])}>
        <meshBasicMaterial color="#fff" transparent opacity={0.18} />
      </mesh>

      {/* Continents (real outlines, cartoon color) */}
      {continentsLatLng.filter(latlngs => latlngs.every(p => Array.isArray(p) && p.length === 2)).map((latlngs, i) => (
        <mesh key={i}>
          <extrudeGeometry args={[
            latLngsToShape(latlngs as [number, number][], globeRadius + 0.01),
            { depth: 0.01, bevelEnabled: false }
          ]} />
          <meshStandardMaterial color="#a8e063" opacity={0.95} transparent />
        </mesh>
      ))}

      {/* Cartoon clouds (white ellipses) */}
      {[[-10, 60, 0.25, 0.13], [20, -80, 0.18, 0.09], [40, 120, 0.22, 0.11], [60, -30, 0.18, 0.09], [-30, 100, 0.22, 0.11]].map((c, i) => {
        const [lat, lng, sx, sy] = c as [number, number, number, number];
        const [x, y, z] = latLngToXYZ(lat, lng, globeRadius + 0.03);
        return (
          <mesh key={i} position={[x, y, z]} scale={[sx, sy, 1]}>
            <sphereGeometry args={[0.13, 24, 24]} />
            <meshStandardMaterial color="#fff" opacity={0.5} transparent />
          </mesh>
        );
      })}

      {cargoLocations.map((location) => (
        <Sphere
          key={location.id}
          args={[0.2, 16, 16]} // Slightly bigger spheres
          position={getPosition(location.lat, location.lng, globeRadius + 0.05)}
          onClick={(e) => {
            e.stopPropagation();
            onLocationClick(location);
          }}
          onPointerOver={(e) => (e.object.scale.set(1.3, 1.3, 1.3), document.body.style.cursor = 'pointer')}
          onPointerOut={(e) => (e.object.scale.set(1, 1, 1), document.body.style.cursor = 'auto')}
        >
          <meshBasicMaterial 
            color={location.type === 'origin' ? "#F9B222" : "#22F9B2"} 
            transparent 
            opacity={0.9} 
          />
        </Sphere>
      ))}

      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />
    </>
  );
};

const Globe3D = () => {
  const [selectedLocation, setSelectedLocation] = useState<CargoLocationData | null>(null);

  const handleLocationClick = (location: CargoLocationData) => {
    setSelectedLocation(location);
  };

  const handleCloseDetailPanel = () => {
    setSelectedLocation(null);
  };

  return (
    <div className="relative w-full h-[300px] md:h-[380px] lg:h-[450px]">
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
        <Suspense fallback={null}>
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            autoRotate
            autoRotateSpeed={0.3}
            minDistance={3}
            maxDistance={8}
            enableDamping={true}
            dampingFactor={0.1}
            target={[0, 0, 0]}
            makeDefault={false}
          />
          <Globe onLocationClick={handleLocationClick} />
          {selectedLocation && (
            <Text
              color={selectedLocation.type === 'origin' ? "#F9B222" : "#22F9B2"}
              anchorX="center"
              anchorY="middle"
              fontSize={0.5}
              position={[0, 0, 2.8]}
              font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
            >
              {selectedLocation.name.toUpperCase()} - {selectedLocation.commonCargoTypes.length} CARGO TYPES
            </Text>
          )}
        </Suspense>
      </Canvas>
      {selectedLocation && (
        <CargoDetailPanel
          location={selectedLocation}
          onClose={handleCloseDetailPanel}
        />
      )}
    </div>
  );
};

// Cargo Detail Panel Component
const CargoDetailPanel: React.FC<{
  location: CargoLocationData;
  onClose: () => void;
}> = ({ location, onClose }) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl max-h-[80vh] overflow-y-auto m-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="mr-2">
                  {location.type === 'origin' ? '📦' : '🏁'}
                </span>
                {location.name}
              </h2>
              <p className="text-gray-600 mt-1">
                {location.type === 'origin' ? 'Shipping Origin' : 'Destination'} • {location.commonCargoTypes.length} Cargo Types
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Cargo Information */}
          <div className="mb-6 space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                <span className="mr-2">📦</span>
                Common Cargo Types We Ship
              </h4>
              <div className="flex flex-wrap gap-2">
                {location.commonCargoTypes.map((cargo, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {cargo}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                  <span className="mr-2">📤</span>
                  Major Exports
                </h4>
                <div className="flex flex-wrap gap-2">
                  {location.majorExports.map((export_, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md">
                      {export_}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
                  <span className="mr-2">📥</span>
                  Major Imports
                </h4>
                <div className="flex flex-wrap gap-2">
                  {location.majorImports.map((import_, index) => (
                    <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-md">
                      {import_}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Shipment Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <span className="mr-2">📊</span>
              Shipping Activity Summary
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Available Cargo Types:</span>
                <span className="ml-2 text-gray-900 font-medium text-lg">{location.commonCargoTypes.length}</span>
              </div>
              <div>
                <span className="text-gray-500">Location Type:</span>
                <span className="ml-2 text-gray-900 font-medium capitalize">{location.type}</span>
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <p>We regularly ship {location.commonCargoTypes.slice(0, 2).join(' and ')} {location.type === 'origin' ? 'from' : 'to'} this location.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Globe3D;